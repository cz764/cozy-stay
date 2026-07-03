import type { Metadata } from "next";
import {
  Playwrite_US_Modern,
  Bricolage_Grotesque,
  Roboto,
} from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
