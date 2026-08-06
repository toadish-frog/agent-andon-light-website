"use client";

import { usePathname } from "next/navigation";

import { NotFoundContent } from "@/app/components/notFoundContent";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/i18n";

/**
 * Client component, not a server one: not-found.tsx doesn't receive route
 * params in the App Router, so the locale is recovered from the URL via
 * usePathname() instead.
 */
export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <NotFoundContent
      locale={locale}
      title={dict.notFound.title}
      homeLabel={dict.notFound.home}
    />
  );
}
