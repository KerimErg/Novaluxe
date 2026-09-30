import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders } from "next/font/google";
import { config } from "@/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// « Big Shoulders Display » est désormais publiée par Google Fonts sous le nom « Big Shoulders »
// (axe de taille optique : les grandes tailles utilisent automatiquement le dessin Display).
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
  variable: "--font-display",
  display: "swap",
});

const text = Archivo({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: `${config.product.shortName} — ${config.shopName}`,
    template: `%s — ${config.shopName}`,
  },
  description: config.product.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFD500" },
    { media: "(prefers-color-scheme: dark)", color: "#07122E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${text.variable}`}>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
