import Link from "next/link";
import { Ship, FileCheck, Globe, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Exports",
  description:
    "Deccan Harvests exports premium Indian spices to 20+ countries. Learn about our export capabilities, Incoterms, packaging and compliance documentation.",
};

const MARKETS = [
  { region: "Middle East", countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"], note: "Primary market — chilli, turmeric" },
  { region: "South-East Asia", countries: ["Singapore", "Malaysia", "Indonesia", "Thailand", "Vietnam"], note: "Chilli, coffee, spice powders" },
  { region: "Europe", countries: ["Germany", "Netherlands", "United Kingdom", "Spain", "France"], note: "EU-compliant lots, pesticide certificates" },
  { region: "North America", countries: ["United States", "Canada"], note: "FDA-registered, HACCP certified" },
  { region: "East Asia", countries: ["Japan", "South Korea", "China"], note: "Premium Arabica, Byadgi chilli" },
  { region: "Oceania & Others", countries: ["Australia", "New Zealand", "South Africa", "Brazil"], note: "Full documentation on request" },
];

const INCOTERMS = [
  { term: "FOB", full: "Free On Board", desc: "We deliver goods to the port of loading in India. Risk transfers once loaded aboard the vessel. Most common for buyers with their own freight forwarder." },
  { term: "CIF", full: "Cost, Insurance & Freight", desc: "We arrange and pay for freight and insurance to the destination port. The buyer handles customs clearance on arrival." },
  { term: "CNF", full: "Cost and Freight", desc: "We cover freight to destination port. Buyer arranges marine insurance independently. Common for buyers in the Middle East and South-East Asia." },
  { term: "DAP", full: "Delivered at Place", desc: "We deliver to the named destination. Buyer responsible for import duties and unloading. Available for select markets on request." },
];

const CAPABILITIES = [
  { icon: Package,    title: "Custom Packaging",   body: "25 kg, 50 kg jute/HDPE sacks. Retail pouches (500 g – 5 kg). Private label available for distributors placing ≥ 5 MT orders." },
  { icon: FileCheck,  title: "Full Documentation",  body: "Certificate of origin, phytosanitary certificate, fumigation certificate, quality test reports, APEDA certificate, packing list & commercial invoice." },
  { icon: Ship,       title: "Port of Loading",     body: "Chennai, Krishnapatnam (Nellore) and Kakinada — the three closest major ports to Guntur. Typical transit time 12–28 days to most destinations." },
  { icon: Globe,      title: "MOQ & Lead Time",     body: "Minimum order: 1 FCL (20-foot container, ~18–20 MT). Lead time: 10–15 business days after PO confirmation. Air freight available for samples." },
];

export default function ExportsPage() {
  return (
    <main className="bg-black-deep min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <p className="section-label mb-4">Global Exports</p>
        <h1
          className="text-[clamp(2.5rem,6vw,5rem)] font-light text-smoke leading-tight max-w-3xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Connecting Indian Farms<br />to Global Buyers
        </h1>
        <p
          className="mt-6 text-[0.9rem] text-white/50 max-w-lg leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          We handle everything from procurement and processing to documentation,
          compliance and freight — so you receive a container-ready shipment
          every time.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 border border-gold text-gold text-[0.72rem] tracking-[0.1em] uppercase hover:bg-gold hover:text-black-deep transition-all duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Request a Quote →
        </Link>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-20 bg-black-rich">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-12">What We Handle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-7 border border-white/10">
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-5">
                  <Icon size={17} className="text-gold" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-[0.92rem] font-normal text-smoke mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[0.8rem] text-white/50 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Export Markets ── */}
      <section className="py-24 bg-black-deep">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-5">Active Markets</p>
          <h2
            className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-14 max-w-xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            20+ Countries Across<br />Four Continents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKETS.map(({ region, countries, note }) => (
              <div key={region} className="p-7 border border-white/10">
                <h3
                  className="text-[0.72rem] tracking-[0.12em] text-gold uppercase mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {region}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {countries.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 text-[0.65rem] text-white/50 border border-white/10 tracking-wide"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p
                  className="text-[0.75rem] text-white/35 italic"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incoterms ── */}
      <section className="py-24 bg-black-rich">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-5">Trade Terms</p>
          <h2
            className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-14"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Incoterms We Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCOTERMS.map(({ term, full, desc }) => (
              <div key={term} className="flex gap-6 p-7 border border-white/10">
                <div className="flex-shrink-0">
                  <span
                    className="inline-block text-[1.4rem] font-light text-gold leading-none"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {term}
                  </span>
                </div>
                <div>
                  <p
                    className="text-[0.72rem] text-white/40 uppercase tracking-[0.08em] mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {full}
                  </p>
                  <p
                    className="text-[0.82rem] text-white/55 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-black-deep border-t border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2
              className="text-[clamp(1.8rem,3vw,2.5rem)] font-light text-smoke"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Ready to place an order?
            </h2>
            <p
              className="mt-2 text-[0.85rem] text-white/50"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Share your specs — we&apos;ll send pricing and availability within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/60 text-[0.72rem] tracking-[0.1em] uppercase hover:border-white/50 hover:text-white/90 transition-all duration-300"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold text-[0.72rem] tracking-[0.1em] uppercase hover:bg-gold hover:text-black-deep transition-all duration-300"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Request a Quote →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
