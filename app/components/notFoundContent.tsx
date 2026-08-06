import Link from "next/link";

import type { Locale } from "@/i18n";

export function NotFoundContent({
  locale,
  title,
  homeLabel,
}: {
  locale: Locale;
  title: string;
  homeLabel: string;
}) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
      <p className="text-sm text-neutral-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      <Link href={`/${locale}/`} className="mt-4 inline-block underline">
        {homeLabel}
      </Link>
    </div>
  );
}
