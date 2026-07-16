import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { SITE_CONFIG } from "@/lib/mock-data";
import "./globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.aboutText,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${josefin.variable} antialiased`}>{children}</body>
    </html>
  );
}
