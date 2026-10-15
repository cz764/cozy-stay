import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Playwrite_US_Modern,
  Bricolage_Grotesque,
  Roboto,
} from "next/font/google";
import BackToTop from "@/components/BackToTop/BackToTop";
import { Header } from "@/components/Header/Header";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { SearchBarSkeleton } from "@/components/SearchBar/SearchBarSkeleton";
import { I18nProvider } from "@/i18n/client";
import { getLocale, getMessages, getT } from "@/i18n/server";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const playwrite = Playwrite_US_Modern({
  display: "swap",
  variable: "--font-playwrite",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.title"), description: t("meta.description") };
}

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${roboto.variable} ${bricolage.variable} ${playwrite.variable} font-sans antialiased`}
      >
        <I18nProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-background">
            <Header />

            <section className="border-b bg-gradient-to-b from-accent/40 to-background">
              <div className="mx-auto max-w-7xl px-6 pt-2 pb-8">
                <div className="mx-auto max-w-3xl">
                  <Suspense fallback={<SearchBarSkeleton />}>
                    <SearchBar />
                  </Suspense>
                </div>
              </div>
            </section>

            <main className="mx-auto w-[90vw] max-w-[1920px] px-6 py-10">
              {children}
            </main>

            <BackToTop />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
