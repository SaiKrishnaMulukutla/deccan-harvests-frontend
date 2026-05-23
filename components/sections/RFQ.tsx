"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import RFQForm from "@/components/ui/RFQForm";

export default function RFQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "#8B1E14" }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left: Copy + Contact ── */}
          <div>
            <motion.p
              className="text-[0.65rem] tracking-[0.18em] text-white/50 uppercase mb-5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              Request a Quote
            </motion.p>

            <motion.h2
              className="text-[clamp(3rem,7vw,6rem)] font-light text-white leading-[0.95] mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s Grow<br />Together
            </motion.h2>

            <motion.p
              className="text-[0.88rem] text-white/60 leading-relaxed max-w-sm mb-12"
              style={{ fontFamily: "var(--font-inter)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              We work directly with importers, wholesalers and distributors.
              Send us your requirements and we&apos;ll respond within 24 hours
              with pricing, specifications and availability.
            </motion.p>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {[
                { icon: Phone, text: "+91 98765 43210" },
                { icon: Mail,  text: "exports@deccanharvests.com" },
                { icon: MapPin, text: "Guntur, Andhra Pradesh, India" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={15} className="text-white/40" strokeWidth={1.5} />
                  <span
                    className="text-[0.82rem] text-white/60"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <RFQForm />
        </div>
      </div>
    </section>
  );
}
