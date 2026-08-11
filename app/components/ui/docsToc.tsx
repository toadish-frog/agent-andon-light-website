"use client";

import { useMemo } from "react";

import type { Heading } from "@/app/utils/mdx";
import { useActiveSection } from "@/app/utils/useActiveSection";
import { cn } from "@/lib/utils";

export function DocsToc({ headings, label }: { headings: Heading[]; label: string }) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId] = useActiveSection(ids);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={label} className="sticky top-24 hidden w-56 shrink-0 xl:block">
      <p className="mb-3 text-xs font-medium tracking-wide text-neutral-400 uppercase">{label}</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "true" : undefined}
              className={cn(
                "-ml-px block border-l py-0.5 pl-3 transition-colors",
                activeId === heading.id
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-black/10 text-neutral-500 hover:text-black dark:border-white/10 dark:text-neutral-400 dark:hover:text-white",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
