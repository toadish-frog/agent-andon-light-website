import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/app/utils/formatDate";
import resourceLinks from "@/content/data/resource-links.json";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n";
import { getAllPosts } from "@/lib/blog";

type CategoryId = "build" | "run";

export default async function ResourcesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{dict.resources.index.heading}</h1>
      <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
        {dict.resources.index.body}
      </p>

      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
            {dict.resources.postsHeading}
          </h2>
          <ul className="mt-4 space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/${lang}/resources/${post.slug}/`} className="block">
                  <p className="font-medium">{post.title}</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {post.description}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {dict.resources.publishedOn} {formatDate(post.date, lang)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resourceLinks.categories.map((category) => (
        <section key={category.id} className="mt-12">
          <h2 className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
            {dict.resources.categories[category.id as CategoryId]}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {category.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-black/10 p-4 transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.03]"
                >
                  <p className="font-medium">{link.title}</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {link.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
