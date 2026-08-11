"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useActiveSection } from "@/app/utils/useActiveSection";
import { usePrefersReducedMotion } from "@/app/utils/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

// Ignore sub-pixel/momentum-scroll jitter (especially mobile Safari) so the
// bar doesn't flicker between shown/hidden on a near-stationary scroll.
const SCROLL_DELTA_THRESHOLD = 8;

/**
 * The product page's own floating sub-nav (Apple product-page pattern, see
 * ARCH-prompt.md §5) — distinct from the global site Nav, which is
 * non-sticking on this page (see nav.tsx) so this is the only bar pinned to
 * the viewport here. Single horizontally-scrolling line at every width (no
 * wrap), auto-hides on scroll up / reappears on scroll down.
 */
export function ProductSectionNav({ sections }: { sections: Section[] }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const [activeId, setActiveId] = useActiveSection(ids);
  const prefersReducedMotion = usePrefersReducedMotion();

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isJumpingRef = useRef(false);
  // Typed as `number` explicitly (not `ReturnType<typeof setTimeout>`) — with
  // @types/node also in the project, that inference resolves to Node's
  // `Timeout`, but this runs in the browser where window.setTimeout returns
  // a plain number.
  const jumpTimeoutRef = useRef<number | undefined>(undefined);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    lastScrollY.current = window.scrollY;

    function updateVisibility() {
      tickingRef.current = false;

      // Only hide/show once the bar has actually engaged its sticky-pinned
      // state (its own rendered top edge is at/above the viewport top) —
      // checked via the real DOM rect, not a guessed scrollY number. Hiding
      // it *before* that would translate a still-in-normal-flow element up
      // into the Nav bar directly above it (visible ghosting through the
      // shared backdrop-blur/transparency).
      const rect = navRef.current?.getBoundingClientRect();
      const isEngaged = (rect?.top ?? 1) <= 1;

      if (!isEngaged) {
        setHidden((prev) => (prev ? false : prev));
        lastScrollY.current = window.scrollY;
        return;
      }

      // A click's own smooth-scroll jump is handled separately — never
      // treated as a "manual" scroll for hide/show purposes.
      if (isJumpingRef.current) return;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
        setHidden(delta < 0);
        lastScrollY.current = currentScrollY;
      }
    }

    function handleScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(updateVisibility);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

  const handleSectionClick = useCallback(
    (id: string) => {
      isJumpingRef.current = true;
      setHidden(false);
      setActiveId(id);

      window.clearTimeout(jumpTimeoutRef.current);
      const resume = () => {
        isJumpingRef.current = false;
        lastScrollY.current = window.scrollY;
        window.clearTimeout(jumpTimeoutRef.current);
        window.removeEventListener("scrollend", resume);
      };
      // `scrollend` covers the normal case; the timeout is a safety net for
      // browsers without it, or if the smooth-scroll gets interrupted.
      window.addEventListener("scrollend", resume);
      jumpTimeoutRef.current = window.setTimeout(resume, 1000);
    },
    [setActiveId],
  );

  // Keep the active pill fully in view within the horizontally scrolling row.
  useEffect(() => {
    if (!activeId) return;
    linkRefs.current[activeId]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId, prefersReducedMotion]);

  return (
    <motion.nav
      ref={navRef}
      aria-label="Product sections"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeInOut" }}
      className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50"
    >
      <ul className="no-scrollbar edge-fade-x mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-6 py-3 text-sm whitespace-nowrap">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              ref={(el) => {
                linkRefs.current[section.id] = el;
              }}
              href={`#${section.id}`}
              onClick={() => handleSectionClick(section.id)}
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
    </motion.nav>
  );
}
