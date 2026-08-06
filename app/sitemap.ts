import type { MetadataRoute } from "next";

import { locales } from "@/i18n";

// Required for route handlers under output: 'export' (static export).
export const dynamic = "force-static";

// TODO: swap in the real production origin once hosting is finalized.
const SITE_URL = "https://agent-andon-light.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/`,
    lastModified: new Date(),
  }));
}
