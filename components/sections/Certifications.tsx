"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Award, Leaf, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Certification } from "@/lib/types";

function iconForCert(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("iso"))    return ShieldCheck;
  if (n.includes("haccp"))  return Award;
  if (n.includes("apeda"))  return BadgeCheck;
  if (n.includes("spice"))  return Leaf;
  return ShieldCheck;
}

export default function Certifications({ certs }: { certs: Certification[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="certifications" className="bg-ivory py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

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
          className="text-[0.88rem] text-muted leading-relaxed mb-12 max-w-lg"
          style={{ fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Every batch is tested, certified, and compliant with international
          food safety and export standards before it leaves our facility.
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map((cert, i) => {
            const Icon = iconForCert(cert.name);
            return (
              <motion.div
                key={cert.id}
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
                  {cert.name}
                </p>
                <p
                  className="text-[0.7rem] text-muted leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cert.issuingBody}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
