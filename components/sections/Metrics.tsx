"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CounterUp } from "@/components/ui/CounterUp";

const STATS = [
  { value: 20,   suffix: "+", label: "Countries\nExported",   sub: "Across 4 continents" },
  { value: 1000, suffix: "+", label: "Tons\nDelivered",        sub: "Every year" },
  { value: 50,   suffix: "+", label: "Global\nPartners",       sub: "Active relationships" },
  { value: 15,   suffix: "+", label: "Years\nExperience",      sub: "Since 2009" },
];

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-ivory overflow-hidden">
      {/* Top rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black-deep/8">
          {STATS.map(({ value, suffix, label, sub }, i) => (
            <motion.div
              key={label}
              className="flex flex-col px-6 lg:px-10 first:pl-0 last:border-r-0 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Giant number */}
              <p
                className="text-[clamp(3.5rem,8vw,7rem)] font-light leading-none text-gold tracking-tight mb-3"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                <CounterUp to={value} suffix={suffix} />
              </p>

              {/* Label — two lines via whitespace-pre */}
              <p
                className="text-[0.72rem] font-medium text-black-deep tracking-[0.07em] uppercase leading-[1.5] mb-1 whitespace-pre-line"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {label}
              </p>

              {/* Sub */}
              <p
                className="text-[0.68rem] text-muted"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
