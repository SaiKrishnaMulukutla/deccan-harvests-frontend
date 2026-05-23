"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Award, Leaf, BadgeCheck } from "lucide-react";

const CERTS = [
  {
    icon: ShieldCheck,
    name: "ISO 22000",
    subtitle: "Food Safety Management System",
  },
  {
    icon: Award,
    name: "HACCP",
    subtitle: "Hazard Analysis Critical Control Points",
  },
  {
    icon: BadgeCheck,
    name: "APEDA",
    subtitle: "Agricultural & Processed Food Products Export",
  },
  {
    icon: Leaf,
    name: "Spices Board",
    subtitle: "Ministry of Commerce, Government of India",
  },
];

const COUNTRIES = [
  "China", "United States", "United Kingdom", "Germany", "Netherlands",
  "UAE", "Saudi Arabia", "Singapore", "Malaysia",
  "Australia", "Canada", "Japan", "South Korea",
];

export default function Certifications() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="quality" className="bg-ivory py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left: Certifications ── */}
          <div>
            <motion.p
              className="section-label mb-5"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              Certifications
            </motion.p>

            <motion.h2
              className="text-[clamp(2rem,3.5vw,2.8rem)] font-normal text-black-deep leading-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Quality You Can Trust
            </motion.h2>

            <motion.p
              className="text-[0.88rem] text-muted leading-relaxed mb-12 max-w-sm"
              style={{ fontFamily: "var(--font-inter)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Every batch is tested, certified, and compliant with international
              food safety and export standards before it leaves our facility.
            </motion.p>

            <div className="grid grid-cols-2 gap-5">
              {CERTS.map(({ icon: Icon, name, subtitle }, i) => (
                <motion.div
                  key={name}
                  className="flex flex-col items-start p-5 border border-ivory-dark bg-smoke"
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-4 bg-ivory">
                    <Icon size={17} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-[0.82rem] font-semibold text-black-deep mb-1 tracking-[0.04em]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {name}
                  </p>
                  <p
                    className="text-[0.7rem] text-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {subtitle}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Export Countries ── */}
          <div>
            <motion.p
              className="section-label mb-5"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Global Reach
            </motion.p>

            <motion.h2
              className="text-[clamp(2rem,3.5vw,2.8rem)] font-normal text-black-deep leading-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              Delivering Goodness<br />Across the World
            </motion.h2>

            <motion.p
              className="text-[0.88rem] text-muted leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: "var(--font-inter)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Our supply chain spans four continents. We work directly with
              importers, distributors and wholesalers to ensure seamless,
              reliable delivery at scale.
            </motion.p>

            {/* Country tags */}
            <div className="flex flex-wrap gap-2.5">
              {COUNTRIES.map((country, i) => (
                <motion.span
                  key={country}
                  className="px-3.5 py-1.5 text-[0.7rem] tracking-[0.07em] border border-ivory-dark text-black-deep/60 uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.04 }}
                >
                  {country}
                </motion.span>
              ))}
              <motion.span
                className="px-3.5 py-1.5 text-[0.7rem] tracking-[0.07em] border border-gold/40 text-gold uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + COUNTRIES.length * 0.04 }}
              >
                + 8 More
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
