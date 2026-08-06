"use client";

import Link from "next/link";

import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n";

/**
 * Client boundary for the landing page. Phase 0 renders static placeholder
 * copy; Phase 1 replaces this section with the LiveStatusStrip hero and
 * Aceternity-sourced background treatment (see ARCHITECTURE.md §2.4).
 */
export function HomeClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["home"];
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="font-mono text-sm text-neutral-500">{dict.eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{dict.title}</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400">{dict.subtitle}</p>
      <div className="flex gap-4">
        <Link
          href={`/${locale}/product/`}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          {dict.ctaProduct}
        </Link>
        <Link
          href={`/${locale}/docs/`}
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium dark:border-white/20"
        >
          {dict.ctaDocs}
        </Link>
      </div>
    </section>
  );
}
