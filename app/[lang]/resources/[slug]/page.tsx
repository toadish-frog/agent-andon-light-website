import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { formatDate } from "@/app/utils/formatDate";
import { mdxLinkComponents } from "@/app/utils/mdx";
import { shikiOptions } from "@/app/utils/shiki";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, isLocale, locales } from "@/i18n";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export default async function ResourcePostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  let post: ReturnType<typeof getPostBySlug>;
  try {
    post = getPostBySlug(slug, lang);
  } catch {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-6 py-16">
      {lang !== defaultLocale && !post.translated && (
        <p className="not-prose mb-6 rounded-lg border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-400">
          {dict.docs.notTranslated}
        </p>
      )}
      <p className="not-prose text-sm text-neutral-400">
        {dict.resources.publishedOn} {formatDate(post.date, lang)}
      </p>
      <h1>{post.title}</h1>
      <MDXRemote
        source={post.content}
        components={mdxLinkComponents(lang)}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeShiki, shikiOptions]],
          },
        }}
      />
    </article>
  );
}
