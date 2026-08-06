"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n";

/**
 * Syncs <html lang> to the active locale. Needed because the <html> tag only
 * exists in the root layout (app/layout.tsx), which sits above the [lang]
 * segment and has no locale to render it with server-side.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
