import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Origin from "@/components/sections/Origin";
import Products from "@/components/sections/Products";
import Metrics from "@/components/sections/Metrics";
import Process from "@/components/sections/Process";
import Certifications from "@/components/sections/Certifications";
import GlobalReach from "@/components/sections/GlobalReach";
import Gallery from "@/components/sections/Gallery";
import RFQ from "@/components/sections/RFQ";
import { apiFetch } from "@/lib/api";
import type { Product, Certification } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://deccanharvests.com";

export const metadata: Metadata = {
  title: "Deccan Harvests — Premium Guntur Chilli & Spice Exports",
  description:
    "From the fertile fields of Guntur, Andhra Pradesh to global markets. Premium quality Teja chilli, Byadgi, turmeric and spice exports trusted by partners in 20+ countries.",
  keywords: ["Guntur chilli", "spice exports", "Teja chilli", "Byadgi chilli", "turmeric export", "India spices", "Andhra Pradesh"],
  openGraph: {
    title: "Deccan Harvests — Premium Guntur Chilli & Spice Exports",
    description: "Premium quality Teja chilli, Byadgi, turmeric and spice exports trusted by partners in 20+ countries.",
    type: "website",
    url: BASE_URL,
    siteName: "Deccan Harvests",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Deccan Harvests",
  legalName: "Mulukutla Exports Pvt. Ltd.",
  url: BASE_URL,
  description: "Premium Guntur chilli, turmeric and spice exporter from Andhra Pradesh, India.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Guntur",
    addressRegion: "Andhra Pradesh",
    postalCode: "522 001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98765-43210",
    contactType: "sales",
    email: "exports@deccanharvests.com",
    areaServed: "Worldwide",
  },
};

export default async function HomePage() {
  const [products, certs] = await Promise.all([
    apiFetch<Product[]>("/api/v1/products", { revalidate: 3600 }),
    apiFetch<Certification[]>("/api/v1/certifications", { revalidate: 3600 }),
  ]);

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <Hero />
      <Origin />
      <Products products={products ?? []} />
      <Metrics />
      <Process />
      <Certifications certs={certs ?? []} />
      <GlobalReach />
      <Gallery />
      <RFQ />
      <Footer />
    </main>
  );
}
