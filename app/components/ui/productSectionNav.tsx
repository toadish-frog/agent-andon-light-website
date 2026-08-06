"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

/**
 * The product page's own floating sub-nav (Apple product-page pattern, see
 * ARCH-prompt.md §5) — distinct from the global site Nav, which keeps
 * rendering above it (brand, primary links, locale/theme). This one only
 * exists to jump between and highlight this page's own sections.
 */
export function ProductSectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Product sections"
      className="sticky top-16 z-40 flex justify-center border-b border-black/5 bg-white/80 py-3 backdrop-blur dark:border-white/10 dark:bg-black/50"
    >
      <ul className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-black/10 bg-white/60 p-1 text-sm dark:border-white/10 dark:bg-black/40">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={activeId === section.id ? "true" : undefined}
              className={cn(
                "block rounded-full px-3 py-1.5 transition-colors",
                activeId === section.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-black/5 dark:hover:bg-white/10",
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
