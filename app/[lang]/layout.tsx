import { notFound } from "next/navigation";

import { Footer } from "@/app/components/footer";
import { HtmlLang } from "@/app/components/htmlLang";
import { MainContent } from "@/app/components/mainContent";
import { Nav } from "@/app/components/nav";
import { ThemeProvider } from "@/app/components/theme-provider";
import { getDictionary } from "@/dictionaries";
import { isLocale, locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HtmlLang locale={lang} />
      <Nav locale={lang} dict={dict.nav} />
      <MainContent>{children}</MainContent>
      <Footer dict={dict.footer} />
    </ThemeProvider>
  );
}
