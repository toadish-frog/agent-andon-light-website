import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { defaultLocale, locales, type Locale } from "@/i18n";

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

// Same convention as app/utils/mdx.tsx: post.mdx (English) alongside
// post.ja.mdx / post.zh-sm.mdx / post.zh-tr.mdx (translations).
const LOCALE_SUFFIX_PATTERN = new RegExp(
  `\\.(${locales.filter((locale) => locale !== defaultLocale).join("|")})\\.mdx$`,
);

export interface PostFrontmatter {
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-08-07". */
  date: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface PostEntry extends PostMeta {
  content: string;
  /** True if a locale-specific file was found; false means this is the English fallback. */
  translated: boolean;
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(RESOURCES_DIR)
    .filter((file) => file.endsWith(".mdx") && !LOCALE_SUFFIX_PATTERN.test(file))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string, locale: Locale = defaultLocale): PostEntry {
  const basePath = path.join(RESOURCES_DIR, slug);
  const localizedPath = `${basePath}.${locale}.mdx`;
  const englishPath = `${basePath}.mdx`;

  const translated = locale !== defaultLocale && fs.existsSync(localizedPath);
  const raw = fs.readFileSync(translated ? localizedPath : englishPath, "utf8");
  const { data, content } = matter(raw);

  return { ...(data as PostFrontmatter), slug, content, translated };
}

/** Newest first. */
export function getAllPosts(locale: Locale = defaultLocale): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const { content: _content, translated: _translated, ...meta } = getPostBySlug(slug, locale);
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
