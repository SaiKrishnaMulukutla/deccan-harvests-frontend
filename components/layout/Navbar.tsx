"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Exports", href: "/exports" },
  { label: "Our Process", href: "/#process" },
  { label: "Quality", href: "/quality" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(10,10,10,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
      >
        <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 group">
            <span
              className="text-[1.05rem] font-semibold tracking-[0.25em] text-smoke uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Deccan
            </span>
            <span
              className="text-[1.05rem] font-semibold tracking-[0.25em] text-gold uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Harvests
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[0.78rem] tracking-[0.08em] text-white/70 hover:text-white transition-colors duration-200 uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-[0.72rem] tracking-[0.1em] uppercase border border-gold text-gold hover:bg-gold hover:text-black-deep transition-all duration-300"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Get a Quote
              <span className="text-xs">→</span>
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white/80 hover:text-white p-1"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black-deep flex flex-col px-8 py-8"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-baseline gap-2">
                <span
                  className="text-[1.05rem] tracking-[0.25em] text-smoke uppercase font-semibold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Deccan
                </span>
                <span
                  className="text-[1.05rem] tracking-[0.25em] text-gold uppercase font-semibold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Harvests
                </span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white p-1"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 mt-16">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-light text-white/80 hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black-deep text-sm font-semibold tracking-widest uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Get a Quote →
              </Link>
              <p className="mt-6 text-xs text-white/30 tracking-wider uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Guntur, Andhra Pradesh, India
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
