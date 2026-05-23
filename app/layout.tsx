import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deccan Harvests — Premium Guntur Chilli & Spice Exports",
  description:
    "From the fertile fields of Guntur, Andhra Pradesh to global markets. Premium quality Teja chilli, Byadgi, turmeric and spice exports trusted by partners in 20+ countries.",
  keywords: ["Guntur chilli", "spice exports", "Teja chilli", "Byadgi chilli", "turmeric export", "India spices", "Andhra Pradesh"],
  openGraph: {
    title: "Deccan Harvests",
    description: "Premium Guntur Chilli & Spice Exports — Trusted Worldwide",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {/* Film grain overlay */}
        <div className="grain" aria-hidden="true" />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
