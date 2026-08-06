import { notFound } from "next/navigation";

import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n";

import { HomeClient } from "./homeClient";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return <HomeClient locale={lang} dict={dict.home} />;
}
