import { intlLocaleTag, type Locale } from "@/i18n";

export function formatDate(dateString: string, locale: Locale): string {
  return new Date(dateString).toLocaleDateString(intlLocaleTag[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
