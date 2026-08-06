export const locales = ["en", "ja", "zh-sm", "zh-tr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  "zh-sm": "简体中文",
  "zh-tr": "繁體中文",
};

/**
 * Chinese locales are labeled with their script name (简/繁), not a national
 * flag — avoids flag-based politics for zh-sm/zh-tr. en/ja may use flag icons
 * in the switcher; zh-sm/zh-tr never do.
 */
export const localeUsesFlag: Record<Locale, boolean> = {
  en: true,
  ja: true,
  "zh-sm": false,
  "zh-tr": false,
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP-47 tags for Intl.* formatting — our internal codes (zh-sm/zh-tr) aren't valid tags themselves. */
export const intlLocaleTag: Record<Locale, string> = {
  en: "en-US",
  ja: "ja-JP",
  "zh-sm": "zh-CN",
  "zh-tr": "zh-TW",
};
