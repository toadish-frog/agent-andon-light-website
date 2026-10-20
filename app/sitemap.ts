import type { MetadataRoute } from "next";

import { locales } from "@/i18n";

// Required for route handlers under output: 'export' (static export).
export const dynamic = "force-static";

const SITE_URL = "https://www.agent-andon-light.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/`,
    lastModified: new Date(),
  }));
}
