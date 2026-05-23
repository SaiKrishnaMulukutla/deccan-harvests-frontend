"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

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
    <section className="relative w-full min-h-[100svh] flex items-center overflow-hidden bg-black-deep pt-28 pb-20 lg:pt-0 lg:pb-0">
      {/* ── Fallback Background Image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
        aria-hidden
      />

      {/* ── Video Background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
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
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col">

        {/* Eyebrow */}
        <motion.p
          className="section-label mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          From the Fields of India
        </motion.p>

        {/* Main headline — 2 lines, scales to any viewport */}
        <div className="flex flex-col gap-y-1 mb-6">
          <div className="overflow-hidden">
            <motion.span
              className="block text-[clamp(2.5rem,9vw,8rem)] leading-[0.92] font-light text-smoke tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              TO GLOBAL
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="block text-[clamp(2.5rem,9vw,8rem)] leading-[0.92] font-light text-smoke tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
            >
              MARKETS
            </motion.span>
          </div>
        </div>

        {/* Subheadline */}
        <motion.p
          className="max-w-md text-[0.95rem] text-white/60 leading-relaxed mb-10 mt-2"
          style={{ fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          Premium quality spices, sourced with care from Guntur's fertile fields
          and exported with trust to the world.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
            className="group flex items-center gap-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                <path d="M0 0v12l10-6z" />
              </svg>
            </span>
            <span className="text-[0.76rem] tracking-[0.16em] uppercase text-white/70 group-hover:text-white transition-colors duration-200">
              Watch Our Story
            </span>
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
