import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type DocSection = "hardware" | "firmware" | "software" | "install";

export interface DocFrontmatter {
  title: string;
  description: string;
  section: DocSection;
  order: number;
}

export interface DocMeta extends DocFrontmatter {
  /** Path segments under content/docs, e.g. ["hardware", "build-guide"]. */
  slug: string[];
}

export interface DocEntry extends DocMeta {
  /** Raw MDX body, frontmatter stripped. */
  content: string;
}

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

function walkMdxFiles(dir: string, base: string[] = []): string[][] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const slugs: string[][] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      slugs.push(...walkMdxFiles(path.join(dir, entry.name), [...base, entry.name]));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      slugs.push([...base, entry.name.replace(/\.mdx$/, "")]);
    }
  }

  return slugs;
}

export function getAllDocSlugs(): string[][] {
  return walkMdxFiles(DOCS_DIR);
}

export function getDocBySlug(slug: string[]): DocEntry {
  const filePath = `${path.join(DOCS_DIR, ...slug)}.mdx`;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    ...(data as DocFrontmatter),
    slug,
    content,
  };
}

export function getAllDocsMeta(): DocMeta[] {
  return getAllDocSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = getDocBySlug(slug);
      return meta;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Pulls ## and ### headings out of raw MDX for the "on this page" TOC. Uses
 * `github-slugger` directly (the same library `rehype-slug` uses internally)
 * so the ids generated here line up exactly with the ids rehype-slug adds to
 * the actually-rendered headings.
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match || !match[1] || !match[2]) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ depth, text, id: slugger.slug(text) });
  }

  return headings;
}
