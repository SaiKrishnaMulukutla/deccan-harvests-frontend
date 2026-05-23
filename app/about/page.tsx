import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, BarChart3, ScanLine } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Metrics from "@/components/sections/Metrics";

export const metadata = {
  title: "About Us",
  description:
    "From the fertile plains of Guntur, Andhra Pradesh — the story of Deccan Harvests, a family-founded export house built on traceability and trust.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    body: "Every shipment comes with full documentation — certificate of origin, phytosanitary certificates, test reports and customs paperwork. We believe buyers deserve complete visibility.",
  },
  {
    icon: BarChart3,
    title: "Consistency",
    body: "We lock specifications before each season. Our grading lines, lab testing protocols and moisture controls ensure you receive the same quality in every container, every time.",
  },
  {
    icon: ScanLine,
    title: "Traceability",
    body: "From field to port, every lot is tagged and logged. We know which farm, which harvest date and which processing batch — so you can answer your own customers' questions with confidence.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-black-deep min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[480px] flex items-end overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Guntur chilli fields"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/40 to-transparent" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 w-full">
          <p className="section-label mb-4">Our Story</p>
          <h1
            className="text-[clamp(2.5rem,6vw,5rem)] font-light text-smoke leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            From the Heart<br />of Guntur
          </h1>
        </div>
      </section>

      {/* ── Founding Story ── */}
      <section className="py-24 lg:py-32 bg-black-deep">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div>
              <p className="section-label mb-5">How We Started</p>
              <h2
                className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                A Decade of Export<br />Experience Distilled
              </h2>
              <div
                className="space-y-5 text-[0.88rem] text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <p>
                  Deccan Harvests is the export arm of Mulukutla Exports Pvt. Ltd., founded in
                  Guntur — the undisputed chilli capital of the world. We started as a small
                  procurement desk working directly with farming communities around Guntur,
                  Khammam and Warangal.
                </p>
                <p>
                  Over fifteen years we built relationships with over 200 farming families,
                  invested in processing and grading infrastructure, and earned certifications
                  that opened doors in the most compliance-strict markets: the European Union,
                  Japan and the United States FDA.
                </p>
                <p>
                  Today we ship to 20+ countries across four continents — but our core discipline
                  has not changed. Every lot we export is one we would stake our reputation on.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Spice processing facility"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-gold/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Guntur Advantage ── */}
      <section className="py-24 lg:py-32 bg-black-rich">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
            <div>
              <p className="section-label mb-5">The Guntur Advantage</p>
              <h2
                className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Why Guntur Chilli<br />Commands a Premium
              </h2>
              <div
                className="space-y-5 text-[0.88rem] text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <p>
                  Guntur district in Andhra Pradesh sits on the Krishna-Godavari deltaic plain —
                  a unique microclimate where the Deccan sun, mineral-rich alluvial soil and
                  centuries of agricultural knowledge converge.
                </p>
                <p>
                  The result is a chilli with naturally high capsaicin (SHU), deep pigmentation
                  (ASTA colour value) and aromatic complexity that cannot be replicated elsewhere.
                  Guntur accounts for over 30% of India&apos;s total chilli exports.
                </p>
                <p>
                  We source exclusively from verified farms within this region, conducting
                  pre-harvest soil and residue tests before procurement to ensure
                  pesticide compliance for EU and US market entry.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 pt-12">
              {[
                { label: "Avg. SHU", value: "50,000+", sub: "Teja S17 variety" },
                { label: "ASTA Colour", value: "150+", sub: "Byadgi variety" },
                { label: "Annual Yield", value: "800K MT", sub: "Guntur district" },
                { label: "Export Share", value: "30%+", sub: "Of India's chilli exports" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="p-6 border border-white/10">
                  <p
                    className="text-[clamp(1.8rem,3vw,2.4rem)] font-light text-gold leading-none mb-1"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-[0.72rem] font-medium text-smoke tracking-[0.06em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[0.7rem] text-white/40"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 lg:py-32 bg-black-deep">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-5">Our Values</p>
          <h2
            className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-16 max-w-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Principles Behind<br />Every Shipment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-white/10 p-8">
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-6">
                  <Icon size={17} className="text-gold" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-[1rem] font-normal text-smoke mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[0.83rem] text-white/50 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics (reuse) ── */}
      <Metrics />

      {/* ── CTA Strip ── */}
      <section className="py-20 bg-black-rich border-t border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2
              className="text-[clamp(1.8rem,3vw,2.5rem)] font-light text-smoke"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Ready to source from us?
            </h2>
            <p
              className="mt-2 text-[0.85rem] text-white/50"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              We respond to all qualified enquiries within 24 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 border border-gold text-gold text-[0.72rem] tracking-[0.1em] uppercase hover:bg-gold hover:text-black-deep transition-all duration-300"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Get in Touch →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
