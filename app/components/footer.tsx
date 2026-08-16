import type { Dictionary } from "@/dictionaries";

const SOURCE_URL = "https://github.com/toadish-frog/agent-andon-light";

export function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer className="border-t border-black/5 px-6 py-10 text-sm text-neutral-500 dark:border-white/10">
      <div className="3xl:max-w-[1800px] mx-auto flex max-w-6xl flex-col gap-2 2xl:max-w-[1440px]">
        <p>{dict.tagline}</p>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit underline"
        >
          {dict.sourceLink}
        </a>
        {/* Placeholder — real disclaimer copy pending, see ARCHITECTURE.md §5. */}
        <p className="text-xs text-neutral-400">{dict.disclaimer}</p>
      </div>
    </footer>
  );
}
