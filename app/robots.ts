import type { MetadataRoute } from "next";

// Required for route handlers under output: 'export' (static export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // TODO: swap in the real production origin once hosting is finalized.
    sitemap: "https://agent-andon-light.example.com/sitemap.xml",
  };
}
