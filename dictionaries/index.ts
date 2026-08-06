import type { Locale } from "../i18n";

import en from "./en.json";
import ja from "./ja.json";
import zhSm from "./zh-sm.json";
import zhTr from "./zh-tr.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ja,
  "zh-sm": zhSm,
  "zh-tr": zhTr,
};

/**
 * All dictionaries are loaded statically (not dynamic-imported) — the whole
 * site is prerendered at build time, so there's no per-request bundle-size
 * cost to worry about the way there would be in a server-rendered app.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
