import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { apiFetch } from "@/lib/api";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],   // light display + medium — 300/600 unused
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],   // regular headings + semibold — 500/700 unused
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],   // body + medium — 300 unused
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600"],   // labels + buttons — 400 unused
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Health check — cached for 60s so it doesn't hit the backend on every request.
  // Returns null if backend is down or unreachable.
  const health = await apiFetch<{ status: string }>("/api/v1/health", { revalidate: 60 });
  const isBackendDown = !health;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {isBackendDown && (
          <div
            className="w-full py-2.5 px-4 text-center text-[0.72rem] tracking-[0.06em] bg-red-900/80 text-white/80"
            style={{ fontFamily: "var(--font-inter)" }}
            role="alert"
          >
            We&apos;re experiencing a temporary issue — quote submissions are unavailable right now. Please try again shortly.
          </div>
        )}
        {/* Film grain overlay */}
        <div className="grain" aria-hidden="true" />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
