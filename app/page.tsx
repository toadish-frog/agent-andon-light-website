"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { defaultLocale, isLocale } from "@/i18n";
import { resolveLocaleFromAcceptLanguage } from "@/lib/locale";

const STORAGE_KEY = "andon-light-locale";

/**
 * Thin redirect shell — no content of its own. Resolves a locale (stored
 * preference, then browser language, then default) and forwards to the real
 * app under /[lang]/. See ARCHITECTURE.md §2.3: this is the client-side
 * fallback path; hosts with edge functions (e.g. Cloudflare Pages) can do
 * the same resolution server-side for a zero-flash redirect instead.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const locale =
      stored && isLocale(stored)
        ? stored
        : resolveLocaleFromAcceptLanguage(
            navigator.languages?.join(",") ?? navigator.language,
          );
    router.replace(`/${locale}/`);
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <noscript>
        <a href={`/${defaultLocale}/`}>Continue to Agent Andon Light</a>
      </noscript>
    </main>
  );
}
