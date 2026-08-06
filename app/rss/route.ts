import { getAllPosts } from "@/lib/blog";

// Required for route handlers under output: 'export' (static export).
export const dynamic = "force-static";

// TODO: swap in the real production origin once hosting is finalized — matches robots.ts/sitemap.ts.
const SITE_URL = "https://agent-andon-light.example.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const posts = getAllPosts();

  // Resource posts are English-only for now (translation is Phase 5), so the
  // feed only covers the English site — see ARCHITECTURE.md §2.3.
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${SITE_URL}/en/resources/${post.slug}/</link>
      <guid>${SITE_URL}/en/resources/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Agent Andon Light — Resources</title>
    <link>${SITE_URL}/en/resources/</link>
    <description>Posts from the Agent Andon Light project.</description>
    <language>en</language>${items}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
