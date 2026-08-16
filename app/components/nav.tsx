"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { locales, localeLabels, type Locale } from "@/i18n";
import type { Dictionary } from "@/dictionaries";
import { cn } from "@/lib/utils";
import { useHasMounted } from "@/app/utils/useHasMounted";
import { useIsProductPage } from "@/app/utils/useIsProductPage";

const STORAGE_KEY = "andon-light-locale";

// zh-sm / zh-tr use script characters (简/繁), not national flags — see
// i18n.ts localeUsesFlag and ARCHITECTURE.md §2.3.
const localeGlyph: Record<Locale, string> = {
  en: "🇺🇸",
  ja: "🇯🇵",
  "zh-sm": "简",
  "zh-tr": "繁",
};

/**
 * Site-wide nav — fixed to the viewport on every page except the product
 * page, where it's non-sticking (normal document flow) because that page
 * has its own floating ProductSectionNav instead, à la the Apple
 * product-page pattern referenced in ARCH-prompt.md §5.
 */
export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary["nav"] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const isProductPage = useIsProductPage();

  const links = [
    { href: `/${locale}/`, label: dict.home },
    { href: `/${locale}/product/`, label: dict.product },
    { href: `/${locale}/docs/`, label: dict.docs },
    { href: `/${locale}/resources/`, label: dict.resources },
  ];

  function handleLocaleChange(next: Locale) {
    window.localStorage.setItem(STORAGE_KEY, next);
    const rest = pathname.replace(/^\/[^/]+/, "");
    router.push(`/${next}${rest || "/"}`);
  }

  // Locale links only ever go through this <select>, not <Link>, so they
  // miss Next's automatic viewport prefetch — that's why the *first* switch
  // to a given locale is slow (cold fetch of that route's RSC payload) while
  // later switches feel instant (cached). Warm all other locales for the
  // current page up front so the first click is fast too.
  useEffect(() => {
    const rest = pathname.replace(/^\/[^/]+/, "");
    for (const l of locales) {
      if (l === locale) continue;
      router.prefetch(`/${l}${rest || "/"}`);
    }
  }, [pathname, locale, router]);

  return (
    <header
      className={cn(
        "z-50 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50",
        isProductPage ? "relative" : "fixed inset-x-0 top-0",
      )}
    >
      <nav className="3xl:max-w-[1800px] mx-auto flex max-w-6xl items-center justify-between px-6 py-4 2xl:max-w-[1440px]">
        <Link href={`/${locale}/`} className="font-mono text-sm font-semibold">
          Agent Andon Light
        </Link>

        <ul className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-opacity hover:opacity-70">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="locale-switcher">
            {dict.language}
          </label>
          <select
            id="locale-switcher"
            value={locale}
            onChange={(event) => handleLocaleChange(event.target.value as Locale)}
            className="rounded-md border border-black/10 bg-[var(--background)] px-2 py-1 text-sm dark:border-white/20"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeGlyph[l]} {localeLabels[l]}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label={dict.themeToggle}
            onClick={() =>
              // Reads the DOM class directly (set by next-themes' anti-flash
              // script before hydration) instead of the `theme` state value,
              // which is `undefined` until mounted — using it here would
              // make a click during that window always resolve to "dark",
              // a no-op when already dark that looks like a dead first click.
              setTheme(
                document.documentElement.classList.contains("dark") ? "light" : "dark",
              )
            }
            className={cn(
              "rounded-md border border-black/10 p-2 transition-colors hover:bg-black/5",
              "dark:border-white/20 dark:hover:bg-white/10",
            )}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
