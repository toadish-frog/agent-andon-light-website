import fs from "node:fs";
import path from "node:path";
import type { ComponentProps } from "react";

import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import Link from "next/link";

import { Note, Warning } from "@/app/components/ui/callout";
import { defaultLocale, locales, type Locale } from "@/i18n";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

// Translated files sit alongside the English original with a locale suffix
// (build-guide.mdx / build-guide.ja.mdx / build-guide.zh-sm.mdx / ...). This
// matches filenames carrying that suffix, so canonical-slug enumeration
// doesn't double-count a doc once it has translations.
const LOCALE_SUFFIX_PATTERN = new RegExp(
  `\\.(${locales.filter((locale) => locale !== defaultLocale).join("|")})\\.mdx$`,
);

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
  /** True if a locale-specific file was found; false means this is the English fallback. */
  translated: boolean;
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
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".mdx") &&
      !LOCALE_SUFFIX_PATTERN.test(entry.name)
    ) {
      slugs.push([...base, entry.name.replace(/\.mdx$/, "")]);
    }
  }

  return slugs;
}

export function getAllDocSlugs(): string[][] {
  return walkMdxFiles(DOCS_DIR);
}

export function getDocBySlug(slug: string[], locale: Locale = defaultLocale): DocEntry {
  const basePath = path.join(DOCS_DIR, ...slug);
  const localizedPath = `${basePath}.${locale}.mdx`;
  const englishPath = `${basePath}.mdx`;

  const translated = locale !== defaultLocale && fs.existsSync(localizedPath);
  const raw = fs.readFileSync(translated ? localizedPath : englishPath, "utf8");
  const { data, content } = matter(raw);

  return {
    ...(data as DocFrontmatter),
    slug,
    content,
    translated,
  };
}

export function getAllDocsMeta(locale: Locale = defaultLocale): DocMeta[] {
  return getAllDocSlugs()
    .map((slug) => {
      const {
        content: _content,
        translated: _translated,
        ...meta
      } = getDocBySlug(slug, locale);
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

/**
 * `components` override for `<MDXRemote>`, shared by docs and resource
 * posts (posts link into `/docs/...` too). Internal links are written in
 * MDX source without a locale prefix (e.g. `/docs/hardware/bom`) and get
 * the current locale spliced in here; external links open in a new tab.
 */
export function mdxLinkComponents(locale: Locale) {
  return {
    Note,
    Warning,
    a: ({ href = "", ...props }: ComponentProps<"a">) => {
      if (href.startsWith("/docs/") || href.startsWith("/resources/")) {
        // Trailing slash (required by next.config's trailingSlash: true) has
        // to land before any #fragment, not after it.
        const [docPath, hash] = href.split("#");
        const normalizedPath = docPath?.endsWith("/") ? docPath : `${docPath}/`;
        const finalHref = `/${locale}${normalizedPath}${hash ? `#${hash}` : ""}`;
        return <Link href={finalHref} {...props} />;
      }
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...props}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        />
      );
    },
  };
}
