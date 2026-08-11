"use client";

import { usePathname } from "next/navigation";

/**
 * True on /{locale}/product — the one route where the global Nav is
 * non-sticking (see FIX-product-page-section-bar.md) because the page has
 * its own floating ProductSectionNav instead.
 */
export function useIsProductPage(): boolean {
  const pathname = usePathname();
  return /^\/[^/]+\/product\/?$/.test(pathname);
}
