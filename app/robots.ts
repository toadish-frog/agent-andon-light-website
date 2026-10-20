import type { MetadataRoute } from "next";

// Required for route handlers under output: 'export' (static export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.agent-andon-light.site/sitemap.xml",
  };
}
