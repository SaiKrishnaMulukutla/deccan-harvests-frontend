"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { Play, ArrowDown } from "lucide-react";

const HEADLINE_WORDS = ["TO", "GLOBAL", "MARKETS"];

export default function Hero() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity =
          window.scrollY > 80 ? "0" : "1";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden bg-black-deep">
      {/* ── Video Background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
      >
        {/* Replace with your actual drone footage */}
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Cinematic Gradient Overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-24 flex flex-col">

        {/* Eyebrow */}
        <motion.p
          className="section-label mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          From the Fields of India
        </motion.p>

        {/* Main headline — word by word */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
          {HEADLINE_WORDS.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                className="block text-[clamp(4rem,10vw,9rem)] leading-[0.9] font-light text-smoke tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.0,
                  delay: 0.7 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subheadline */}
        <motion.p
          className="max-w-md text-[0.95rem] text-white/60 leading-relaxed mb-10 mt-2"
          style={{ fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Premium quality spices, sourced with care from Guntur's fertile fields
          and exported with trust to the world.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/products"
            className="group flex items-center gap-2 px-7 py-3.5 bg-gold text-black-deep text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:bg-gold-light"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Explore Our Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

          <button
            className="flex items-center gap-2.5 text-white/70 hover:text-white text-[0.75rem] tracking-[0.08em] uppercase transition-colors duration-200"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/30 hover:border-white/60 transition-colors duration-200">
              <Play size={11} fill="currentColor" />
            </span>
            Watch Our Story
          </button>
        </motion.div>
      </div>

      {/* ── Slide Counter ── */}
      <motion.div
        className="absolute bottom-10 left-6 lg:left-12 z-10 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span
          className="text-gold text-[0.75rem] tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          01
        </span>
        <div className="w-8 h-px bg-gold/40">
          <div className="h-px bg-gold w-1/2" />
        </div>
        <span
          className="text-white/30 text-[0.75rem] tracking-[0.2em]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          05
        </span>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 right-6 lg:right-12 z-10 flex flex-col items-center gap-2 transition-opacity duration-500"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col items-center gap-1.5"
        >
          <span
            className="text-[0.6rem] tracking-[0.2em] text-white/30 uppercase rotate-90 mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} className="text-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
