"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Certification } from "@/lib/types";

// Extract a short acronym to use as the typographic anchor
function certAcronym(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("iso"))    return "ISO";
  if (n.includes("haccp"))  return "HACCP";
  if (n.includes("apeda"))  return "APEDA";
  if (n.includes("spice"))  return "SPICE";
  if (n.includes("fssai"))  return "FSSAI";
  // Fallback: first word up to 6 chars
  return name.split(/[\s:]/)[0].toUpperCase().slice(0, 6);
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
          className="text-[0.88rem] text-muted leading-relaxed mb-14 max-w-lg"
          style={{ fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Every batch is tested, certified, and compliant with international
          food safety and export standards before it leaves our facility.
        </motion.p>

        {/* Divider list — typographic acronym anchors */}
        <div className="divide-y divide-ivory-dark">
          {certs.map((cert, i) => {
            const acronym = certAcronym(cert.name);
            return (
              <motion.div
                key={cert.id}
                className="flex items-start gap-6 lg:gap-10 py-7"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Typographic anchor */}
                <span
                  className="text-[2rem] leading-none font-light text-gold/60 w-28 flex-shrink-0 pt-0.5 select-none"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                  aria-hidden
                >
                  {acronym}
                </span>

                {/* Details */}
                <div className="flex-1">
                  <p
                    className="text-[0.83rem] font-semibold text-black-deep tracking-[0.04em] mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {cert.name}
                  </p>
                  <p
                    className="text-[0.75rem] text-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {cert.issuingBody}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
