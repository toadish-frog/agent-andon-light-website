import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

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
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(RESOURCES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): PostEntry {
  const filePath = path.join(RESOURCES_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return { ...(data as PostFrontmatter), slug, content };
}

/** Newest first. */
export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = getPostBySlug(slug);
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
