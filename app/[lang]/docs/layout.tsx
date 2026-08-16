import { notFound } from "next/navigation";

import { DocsSidebar } from "@/app/components/ui/docsSidebar";
import { getAllDocsMeta } from "@/app/utils/mdx";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n";

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const docs = getAllDocsMeta(lang);

  return (
    <div className="3xl:max-w-[1800px] mx-auto flex max-w-6xl items-start gap-10 px-6 py-12 2xl:max-w-[1440px]">
      <DocsSidebar docs={docs} locale={lang} sectionLabels={dict.docs.sections} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
