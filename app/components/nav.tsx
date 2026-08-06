"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { locales, localeLabels, type Locale } from "@/i18n";
import type { Dictionary } from "@/dictionaries";
import { cn } from "@/lib/utils";
import { useHasMounted } from "@/app/utils/useHasMounted";

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
 * Fixed, site-wide nav. The Product page (Phase 2) switches this to a
 * floating variant with in-page section links, à la the Apple product-page
 * pattern referenced in ARCH-prompt.md §5 — not implemented yet.
 */
export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary["nav"] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
