import { defaultLocale, isLocale, locales, type Locale } from "@/i18n";

/**
 * Resolves a visitor's locale from an Accept-Language header value. Pure
 * function so it can be reused from both `proxy.ts` (the actual Next.js edge
 * proxy — only runs where the host executes one) and the client-side
 * fallback redirect in `app/page.tsx` (see ARCHITECTURE.md §2.3).
 */
export function resolveLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter((tag): tag is string => Boolean(tag));

  for (const tag of preferred) {
    const match = matchLocale(tag);
    if (match) return match;
  }

  return defaultLocale;
}

function matchLocale(tag: string): Locale | null {
  const normalized = tag.toLowerCase();

  if (isLocale(normalized)) return normalized;

  // BCP-47 Chinese script/region subtags → our zh-sm / zh-tr split.
  if (normalized.startsWith("zh")) {
    if (
      normalized.includes("hant") ||
      normalized.includes("tw") ||
      normalized.includes("hk") ||
      normalized.includes("mo")
    ) {
      return "zh-tr";
    }
    return "zh-sm";
  }

  const primary = normalized.split("-")[0];
  return locales.find((locale) => locale === primary) ?? null;
}
