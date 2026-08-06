import Link from "next/link";

import { defaultLocale } from "@/i18n";

/**
 * Root 404 — reached only for paths with no locale segment at all (e.g. a
 * stale bookmark to a pre-i18n URL). Locale-scoped 404s are handled by
 * app/[lang]/not-found.tsx instead, which can render translated copy.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-neutral-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <Link href={`/${defaultLocale}/`} className="mt-4 inline-block underline">
          Go to Agent Andon Light
        </Link>
      </div>
    </div>
  );
}
