import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllDocsMeta, type DocSection } from "@/app/utils/mdx";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n";

const SECTION_ORDER: DocSection[] = ["hardware", "firmware", "software", "install"];

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const docs = getAllDocsMeta(lang);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{dict.docs.index.heading}</h1>
      <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
        {dict.docs.index.body}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {SECTION_ORDER.map((section) => {
          const items = docs.filter((doc) => doc.section === section);
          if (items.length === 0) return null;

          return (
            <div key={section}>
              <h2 className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
                {dict.docs.sections[section]}
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((doc) => (
                  <li key={doc.slug.join("/")}>
                    <DocCard
                      locale={lang}
                      slug={doc.slug}
                      title={doc.title}
                      description={doc.description}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocCard({
  locale,
  slug,
  title,
  description,
}: {
  locale: Locale;
  slug: string[];
  title: string;
  description: string;
}) {
  return (
    <Link
      href={`/${locale}/docs/${slug.join("/")}/`}
      className="block rounded-xl border border-black/10 p-4 transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.03]"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    </Link>
  );
}
