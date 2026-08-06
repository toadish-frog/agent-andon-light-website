"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DocMeta, DocSection } from "@/app/utils/mdx";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const SECTION_ORDER: DocSection[] = ["hardware", "firmware", "software", "install"];

export function DocsSidebar({
  docs,
  locale,
  sectionLabels,
}: {
  docs: DocMeta[];
  locale: Locale;
  sectionLabels: Record<DocSection, string>;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="sticky top-24 hidden w-56 shrink-0 md:block">
      <div className="space-y-6 text-sm">
        {SECTION_ORDER.map((section) => {
          const items = docs.filter((doc) => doc.section === section);
          if (items.length === 0) return null;

          return (
            <div key={section}>
              <p className="mb-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
                {sectionLabels[section]}
              </p>
              <ul className="space-y-1">
                {items.map((doc) => {
                  const slug = doc.slug.join("/");
                  const href = `/${locale}/docs/${slug}/`;
                  const isActive = pathname === href;

                  return (
                    <li key={slug}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-2 py-1.5 transition-colors",
                          isActive
                            ? "bg-black/5 font-medium text-black dark:bg-white/10 dark:text-white"
                            : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
                        )}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
