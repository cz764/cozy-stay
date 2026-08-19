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

export const metadata: Metadata = {
  title: "cozystays — Escape and relax",
  description:
    "Find your next cozy home to escape from chaos of life and relax to recharge for next destinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${bricolage.variable} ${playwrite.variable} font-sans antialiased`}
      >
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
      </body>
    </html>
  );
}
