import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { shikiOptions } from "@/app/utils/shiki";

import { DocsToc } from "@/app/components/ui/docsToc";
import {
  extractHeadings,
  getAllDocSlugs,
  getDocBySlug,
  mdxLinkComponents,
} from "@/app/utils/mdx";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, isLocale, locales } from "@/i18n";

export function generateStaticParams() {
  const docSlugs = getAllDocSlugs();
  return locales.flatMap((lang) => docSlugs.map((slug) => ({ lang, slug })));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  let doc: ReturnType<typeof getDocBySlug>;
  try {
    doc = getDocBySlug(slug, lang);
  } catch {
    notFound();
  }

  const dict = getDictionary(lang);
  const headings = extractHeadings(doc.content);

  return (
    <div className="flex items-start gap-10">
      <article className="prose prose-neutral dark:prose-invert min-w-0 flex-1">
        {lang !== defaultLocale && !doc.translated && (
          <p className="not-prose mb-6 rounded-lg border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-400">
            {dict.docs.notTranslated}
          </p>
        )}
        <h1>{doc.title}</h1>
        <p>{doc.description}</p>
        <MDXRemote
          source={doc.content}
          components={mdxLinkComponents(lang)}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypeShiki, shikiOptions]],
            },
          }}
        />
      </article>
      <DocsToc headings={headings} label={dict.docs.onThisPage} />
    </div>
  );
}
