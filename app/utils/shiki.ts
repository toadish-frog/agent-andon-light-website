import type { RehypeShikiOptions } from "@shikijs/rehype";

/**
 * Shared `@shikijs/rehype` config for both docs and resource posts. Scoped
 * to just the two languages actually used in this site's code fences (bash
 * transcripts, PowerShell) rather than the full bundled language set, to
 * keep the build lean. `themes` (plural) triggers Shiki's dual-theme output:
 * `light` renders inline as the default, `dark` ships as `--shiki-dark`/
 * `--shiki-dark-bg` CSS variables that `global.css` activates under `.dark`.
 */
export const shikiOptions: RehypeShikiOptions = {
  themes: { light: "github-light", dark: "github-dark" },
  langs: ["bash", "powershell"],
};
