"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given element ids is currently most in view — the
 * shared scroll-spy mechanism behind both `ProductSectionNav` and the docs
 * "on this page" TOC. Also returns a setter so a click handler can pin the
 * active id immediately, rather than waiting for a smooth-scroll jump to
 * finish and the observer to catch up.
 */
export function useActiveSection(
  ids: string[],
): [string | undefined, (id: string) => void] {
  const [activeId, setActiveId] = useState(ids[0]);

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

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  return [activeId, setActiveId];
}
