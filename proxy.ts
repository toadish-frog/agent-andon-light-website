import { NextResponse, type NextRequest } from "next/server";

import { resolveLocaleFromAcceptLanguage } from "@/lib/locale";

/**
 * Next.js's edge request handler (renamed from `middleware` — see
 * https://nextjs.org/docs/messages/middleware-to-proxy). Only meaningful on
 * hosts that actually execute an edge function alongside the static build
 * (e.g. Cloudflare Pages Functions); `output: 'export'` static hosts (GitHub
 * Pages, S3) never invoke this, which is why app/page.tsx carries an
 * independent client-side fallback that reuses the same lib/locale.ts logic.
 * See ARCHITECTURE.md §2.3.
 */
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const locale = resolveLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );
  return NextResponse.redirect(new URL(`/${locale}/`, request.url));
}
