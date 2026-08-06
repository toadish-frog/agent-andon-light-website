import { notFound } from "next/navigation";

import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n";

import { ProductClient } from "./productClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return <ProductClient locale={lang} dict={dict} />;
}
