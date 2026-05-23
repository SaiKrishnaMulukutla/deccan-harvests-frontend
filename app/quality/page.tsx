import Link from "next/link";
import { ShieldCheck, Award, Leaf, BadgeCheck, FlaskConical, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { formatDisplayDate, isExpiringWithin } from "@/lib/utils";
import type { Certification } from "@/lib/types";

export const metadata = {
  title: "Quality & Certifications",
  description:
    "ISO 22000, HACCP, APEDA and Spices Board certified. Every batch tested for pesticide residue, moisture, SHU and ASTA colour value.",
};

const STATIC_CERTS = [
  { icon: ShieldCheck, name: "ISO 22000:2018",     body: "SGS India Pvt. Ltd.",                                                    desc: "Food Safety Management System" },
  { icon: Award,       name: "HACCP",              body: "Bureau Veritas India",                                                    desc: "Hazard Analysis Critical Control Points" },
  { icon: BadgeCheck,  name: "APEDA",              body: "Agricultural & Processed Food Products Export Development Authority",     desc: "Export registration — spices & agricultural produce" },
  { icon: Leaf,        name: "Spices Board",       body: "Ministry of Commerce, Government of India",                              desc: "Export quality certification for spices" },
];

const TESTING = [
  { label: "SHU Measurement",      detail: "Scoville Heat Units determined via HPLC (High Performance Liquid Chromatography) at NABL-accredited labs. Every lot tested per ASTA Method 21.0." },
  { label: "ASTA Colour Value",    detail: "Spectrophotometric method per ASTA 20.1 standard. Ensures consistency for food colourant and paprika oleoresin buyers." },
  { label: "Moisture Content",     detail: "Karl Fischer titration and oven-drying method. All chilli: ≤ 12%, turmeric: ≤ 10%, coffee: ≤ 12%. Critical for shelf-life and mould prevention during transit." },
  { label: "Pesticide Residue",    detail: "Multi-residue screening for 200+ compounds. EU MRL-compliant analysis done per EC 396/2005. Results provided per lot. Japan and US MRL compliance available on request." },
  { label: "Aflatoxin Screening",  detail: "ELISA and LC-MS/MS methods. All lots tested for B1, B2, G1, G2. Total aflatoxins kept below 4 ppb for EU market. Certificate included in shipment documents." },
  { label: "Heavy Metals",         detail: "ICP-MS analysis for lead, cadmium, arsenic and mercury. All products comply with EU Regulation 2023/915 and USFDA tolerance levels." },
];

const COMPLIANCE = [
  { label: "APEDA",            detail: "Mandatory registration under the Agricultural and Processed Food Products Export Development Authority for all agri-export from India. We hold an active RCMC certificate." },
  { label: "FSSAI",            detail: "Licensed food business operator under the Food Safety and Standards Authority of India. License number available in all shipment documents." },
  { label: "Phytosanitary",    detail: "Phytosanitary certificate issued by the Plant Quarantine authorities on every consignment. Certifies absence of pests, pathogens and prohibited plant matter." },
  { label: "Fumigation",       detail: "Methyl bromide fumigation certificate provided for wood packaging material. Compliant with ISPM-15 international standards." },
];

function findCertIcon(certName: string) {
  const match = STATIC_CERTS.find((s) =>
    certName.toLowerCase().includes(s.name.toLowerCase().split(":")[0].toLowerCase())
  );
  return match?.icon ?? ShieldCheck;
}

export default async function QualityPage() {
  const certs = await apiFetch<Certification[]>("/api/v1/certifications", { revalidate: 3600 }) ?? [];

  return (
    <main className="bg-black-deep min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <p className="section-label mb-4">Quality & Standards</p>
        <h1
          className="text-[clamp(2.5rem,6vw,5rem)] font-light text-smoke leading-tight max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          We Hold Ourselves to the<br />Highest International Standards
        </h1>
        <p
          className="mt-5 text-[0.9rem] text-white/50 max-w-lg leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Every batch is tested, certified and fully documented before leaving
          our facility. No exceptions.
        </p>
      </section>

      {/* ── Certifications from API ── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p
            className="text-[0.65rem] tracking-[0.18em] text-muted uppercase mb-10"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Active Certifications
          </p>

          {certs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certs.map((cert) => {
                const renewalPending = isExpiringWithin(cert.expiresAt);
                const Icon = findCertIcon(cert.name);

                return (
                  <div key={cert.id} className="relative p-6 bg-smoke border border-ivory-dark">
                    {renewalPending && (
                      <span
                        className="absolute top-4 right-4 px-2.5 py-1 text-[0.6rem] tracking-widest uppercase bg-gold/20 text-gold border border-gold/30"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        Renewal Pending
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-5 bg-ivory">
                      <Icon size={17} className="text-gold" strokeWidth={1.5} />
                    </div>
                    <h3
                      className="text-[0.88rem] font-semibold text-black-deep mb-1 tracking-[0.03em]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {cert.name}
                    </h3>
                    <p
                      className="text-[0.72rem] text-muted leading-relaxed mb-4"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cert.issuingBody}
                    </p>
                    <div
                      className="text-[0.7rem] text-black-deep/50 space-y-1 mb-4"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cert.certNumber && <p>No. {cert.certNumber}</p>}
                      <p>Issued {formatDisplayDate(cert.issuedAt)}</p>
                      {cert.expiresAt && <p>Valid until {formatDisplayDate(cert.expiresAt)}</p>}
                    </div>
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.7rem] text-gold tracking-[0.06em] uppercase hover:text-gold-dark transition-colors"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        Download Certificate <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Static fallback if DB is empty */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STATIC_CERTS.map(({ icon: Icon, name, body, desc }) => (
                <div key={name} className="flex flex-col items-start p-6 border border-ivory-dark bg-smoke">
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-4 bg-ivory">
                    <Icon size={17} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <p className="text-[0.82rem] font-semibold text-black-deep mb-1 tracking-[0.04em]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{name}</p>
                  <p className="text-[0.7rem] text-muted leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
                  <p className="text-[0.68rem] text-muted/70 mt-1" style={{ fontFamily: "var(--font-inter)" }}>{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testing Standards ── */}
      <section className="py-24 bg-black-deep">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-start gap-4 mb-12">
            <FlaskConical size={22} className="text-gold mt-1 flex-shrink-0" strokeWidth={1.3} />
            <div>
              <p className="section-label mb-3">Testing Protocols</p>
              <h2
                className="text-[clamp(1.8rem,3vw,2.5rem)] font-normal text-smoke leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                What We Test On Every Lot
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTING.map(({ label, detail }) => (
              <div key={label} className="p-6 border border-white/10">
                <p
                  className="text-[0.78rem] font-semibold text-smoke tracking-[0.05em] mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {label}
                </p>
                <p
                  className="text-[0.81rem] text-white/50 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Export Compliance ── */}
      <section className="py-24 bg-black-rich">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-5">Export Compliance</p>
          <h2
            className="text-[clamp(1.8rem,3vw,2.5rem)] font-normal text-smoke leading-tight mb-12"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Documentation in Every Shipment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMPLIANCE.map(({ label, detail }) => (
              <div key={label} className="flex gap-5 p-6 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                <div>
                  <p
                    className="text-[0.78rem] font-semibold text-smoke tracking-[0.05em] mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[0.81rem] text-white/50 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-black-deep border-t border-white/8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p
            className="text-[0.9rem] text-white/60 max-w-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Need full documentation for your procurement approval? We&apos;ll send
            the complete certificate pack within 24 hours.
          </p>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 border border-gold text-gold text-[0.72rem] tracking-[0.1em] uppercase hover:bg-gold hover:text-black-deep transition-all duration-300"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Contact Us →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
