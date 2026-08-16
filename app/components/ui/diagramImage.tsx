import Image from "next/image";

/**
 * For diagrams with annotations baked into the image itself (arrows, labels)
 * rather than drawn as theme-aware SVG/CSS. The wrapper background stays
 * light in both themes (`neutral-100` / `neutral-300`, never a dark tone),
 * since the baked-in annotation text in the source image is plain black and
 * would go unreadable on a truly dark card — but it still dims for dark
 * mode instead of just re-showing the light-mode white, so it doesn't read
 * as a leftover stark-white box on a dark page. Used directly in MDX source
 * as `<DiagramImage />`.
 *
 * `width`/`height` are typed as `string | number`: MDX source has to pass
 * them as quoted attributes (`width="1796"`, not `width={1796}`) — the
 * JSX-expression-brace form silently drops the prop entirely under this
 * project's `next-mdx-remote` compiler, confirmed by inspecting the actual
 * props object reaching this component at build time. `next/image` itself
 * requires a real number, so the string form is coerced below.
 */
export function DiagramImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
}) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-black/10 bg-neutral-100 p-4 dark:border-white/10 dark:bg-neutral-700">
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        className="h-auto w-full"
      />
    </div>
  );
}
