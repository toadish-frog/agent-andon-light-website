"use client";

import { useIsProductPage } from "@/app/utils/useIsProductPage";
import { cn } from "@/lib/utils";

/**
 * Wraps <main>. Every route gets pt-16 to clear the fixed Nav — except the
 * product page, where Nav is non-sticking (normal document flow), so the
 * offset would just leave a blank gap.
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  const isProductPage = useIsProductPage();

  return <main className={cn(!isProductPage && "pt-16")}>{children}</main>;
}
