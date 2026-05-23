"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RFQForm from "@/components/ui/RFQForm";

const CONTACT_ITEMS = [
  { icon: Phone,  label: "Phone",   value: "+91 98765 43210",                    href: "tel:+919876543210" },
  { icon: Mail,   label: "Email",   value: "exports@deccanharvests.com",          href: "mailto:exports@deccanharvests.com" },
  { icon: MapPin, label: "Address", value: "Guntur, Andhra Pradesh — 522 001, India", href: null },
];

const JOURNEY_STEPS = [
  { number: "01", label: "Share your specs" },
  { number: "02", label: "Pricing in 24 hours" },
  { number: "03", label: "Ship worldwide" },
];

const CERT_BADGES = ["ISO 22000", "HACCP", "APEDA", "Spices Board", "FSSAI"];

const FAQS = [
  {
    q: "What is your minimum order quantity?",
    a: "1 FCL (20-foot container), which holds approximately 18–20 metric tons depending on the product. For initial sampling, we can arrange smaller shipments of 100–500 kg at a courier rate.",
  },
  {
    q: "What payment terms do you offer?",
    a: "Established buyers: 30% advance with order, 70% against BL copy. New buyers: 100% advance or irrevocable LC at sight from a first-class bank. We are open to discussing terms for repeat business.",
  },
  {
    q: "Which Incoterms do you support?",
    a: "We regularly ship on FOB (Chennai / Krishnapatnam / Kakinada), CIF and CNF. DAP is available for select markets. Our team will advise the most cost-effective Incoterm for your destination.",
  },
  {
    q: "What is the typical lead time from order to shipment?",
    a: "10–15 business days from confirmed purchase order — this covers final procurement, grading, testing, fumigation and documentation. Urgent orders may be possible for in-stock material; contact us for availability.",
  },
  {
    q: "Can you do private label / custom packaging?",
    a: "Yes. We offer custom HDPE sacks (10 kg, 25 kg, 50 kg) and retail pouches (250 g – 5 kg) with your branding. Minimum quantity for private label is 5 MT. Design approval turnaround is 3–5 business days.",
  },
  {
    q: "Do you provide samples before we commit to a full order?",
    a: "Absolutely. We send 200–500 g samples via DHL/FedEx at buyer's cost. Sample lead time is 2–3 business days. We recommend requesting samples from at least two product grades before placing a first order.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span
          className="text-[0.88rem] text-smoke/80"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-gold flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p
              className="text-[0.84rem] text-white/50 leading-relaxed pb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-black-deep min-h-screen">
      <Navbar />

      {/* ── Section 1: Narrative Hero ── */}
      <section className="relative pt-40 pb-24 bg-black-deep overflow-hidden">
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(201,168,76,0.5) 60px, rgba(201,168,76,0.5) 61px)",
          }}
          aria-hidden
        />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.p
            className="section-label mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Get in Touch
          </motion.p>

          <motion.h1
            className="text-[clamp(2.8rem,7vw,6rem)] font-light text-smoke leading-[0.95] max-w-3xl mb-8"
            style={{ fontFamily: "var(--font-cormorant)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Every Great<br />Partnership Starts with<br />a Conversation
          </motion.h1>

          <motion.p
            className="text-[0.9rem] text-white/50 max-w-md leading-relaxed mb-14"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            We&apos;ve shipped to 20+ countries. Tell us where you want to go next.
          </motion.p>

          {/* 3-step journey */}
          <motion.div
            className="flex flex-wrap items-center gap-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {JOURNEY_STEPS.map(({ number, label }, i) => (
              <div key={number} className="flex items-center">
                <div className="flex items-center gap-3 px-5 first:pl-0">
                  <span
                    className="text-[0.6rem] text-gold/40 tracking-[0.18em] uppercase"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {number}
                  </span>
                  <span
                    className="text-[0.82rem] text-white/60"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {label}
                  </span>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <span className="text-white/15 px-2 hidden sm:block">→</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Form + Trust ── */}
      <section className="relative py-24 bg-red-chilli-deep overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)",
          }}
          aria-hidden
        />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 items-start">

            {/* Left: Trust column */}
            <div>
              <p
                className="text-[0.62rem] tracking-[0.2em] text-white/40 uppercase mb-7"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Who We Work With
              </p>
              <p
                className="text-[0.92rem] text-white/70 leading-[1.8] mb-10"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                We partner directly with importers, distributors and wholesale
                buyers across the Middle East, Europe, South-East Asia and North
                America. If you move volume, we want to talk.
              </p>

              {/* Cert badges */}
              <div className="flex flex-wrap gap-2 mb-12">
                {CERT_BADGES.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 text-[0.62rem] tracking-[0.1em] uppercase border border-white/20 text-white/50"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {cert}
                  </span>
                ))}
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-5">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-white/40" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p
                        className="text-[0.58rem] text-white/30 uppercase tracking-widest mb-0.5"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-[0.82rem] text-white/65 hover:text-white transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-[0.82rem] text-white/65"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: RFQ Form */}
            <RFQForm />
          </div>
        </div>
      </section>

      {/* ── Section 3: FAQ ── */}
      <section className="py-24 bg-black-deep">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <p className="section-label mb-5">FAQ</p>
            <h2
              className="text-[clamp(2rem,3.5vw,3rem)] font-normal text-smoke leading-tight mb-12"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Common Buyer Questions
            </h2>
            <div>
              {FAQS.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
