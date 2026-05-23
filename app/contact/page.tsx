"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RFQForm from "@/components/ui/RFQForm";

const CONTACT_ITEMS = [
  { icon: Phone,  label: "Phone",   value: "+91 98765 43210",          href: "tel:+919876543210" },
  { icon: Mail,   label: "Email",   value: "exports@deccanharvests.com", href: "mailto:exports@deccanharvests.com" },
  { icon: MapPin, label: "Address", value: "Guntur, Andhra Pradesh — 522 001, India", href: null },
];

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
          className="text-[0.88rem] text-smoke/80 group-hover:text-smoke transition-colors"
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

      {/* ── Main Contact Section ── */}
      <section
        className="relative py-24 lg:py-32 overflow-hidden bg-red-chilli-deep"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: Heading + Contact Info + Map */}
            <div>
              <p
                className="text-[0.65rem] tracking-[0.18em] text-white/50 uppercase mb-5"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Get in Touch
              </p>
              <h1
                className="text-[clamp(3rem,7vw,6rem)] font-light text-white leading-[0.95] mb-6"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Let&apos;s Grow<br />Together
              </h1>
              <p
                className="text-[0.88rem] text-white/60 leading-relaxed max-w-sm mb-10"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                We work directly with importers, wholesalers and distributors.
                Share your requirements and we&apos;ll respond within 24 hours
                with pricing, specifications and availability.
              </p>

              <div className="flex flex-col gap-5 mb-10">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-white/50" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p
                        className="text-[0.6rem] text-white/30 uppercase tracking-widest mb-0.5"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-[0.85rem] text-white/70 hover:text-white transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-[0.85rem] text-white/70"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Embed */}
              <div className="w-full aspect-video overflow-hidden border border-white/20 opacity-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122028.04823296!2d80.3765!3d16.3067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a74e12b7b1d6b%3A0x100a1c7a5e!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Guntur, Andhra Pradesh — Deccan Harvests"
                />
              </div>
            </div>

            {/* Right: RFQ Form */}
            <RFQForm />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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
