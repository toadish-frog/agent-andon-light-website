import type { ComponentProps } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { DocsToc } from "@/app/components/ui/docsToc";
import { extractHeadings, getAllDocSlugs, getDocBySlug } from "@/app/utils/mdx";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n";

export function generateStaticParams() {
  const docSlugs = getAllDocSlugs();
  return locales.flatMap((lang) => docSlugs.map((slug) => ({ lang, slug })));
}

function mdxComponents(locale: Locale) {
  return {
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      if (href.startsWith("/docs/")) {
        // Trailing slash (required by next.config's trailingSlash: true) has
        // to land before any #fragment, not after it.
        const [docPath, hash] = href.split("#");
        const normalizedPath = docPath?.endsWith("/") ? docPath : `${docPath}/`;
        const finalHref = `/${locale}${normalizedPath}${hash ? `#${hash}` : ""}`;
        return <Link href={finalHref} {...props} />;
      }
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...props}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        />
      );
    },
  };
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
    doc = getDocBySlug(slug);
  } catch {
    notFound();
  }

  const dict = getDictionary(lang);
  const headings = extractHeadings(doc.content);

  return (
    <div className="flex items-start gap-10">
      <article className="prose prose-neutral dark:prose-invert min-w-0 flex-1">
        {lang !== defaultLocale && (
          <p className="not-prose mb-6 rounded-lg border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-400">
            {dict.docs.notTranslated}
          </p>
        )}
        <h1>{doc.title}</h1>
        <p>{doc.description}</p>
        <MDXRemote
          source={doc.content}
          components={mdxComponents(lang)}
          options={{
            mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
          }}
        />
      </article>
      <DocsToc headings={headings} label={dict.docs.onThisPage} />
    </div>
  );
}
