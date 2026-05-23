import React from "react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Products",    href: "/products" },
  { label: "Exports",     href: "/exports" },
  { label: "Our Process", href: "/#process" },
];

const COMPANY_LINKS = [
  { label: "About Us",       href: "/about" },
  { label: "Quality",        href: "/quality" },
  { label: "Certifications", href: "/quality#certifications" },
  { label: "Contact Us",     href: "/contact" },
];

// Inline brand SVG icons (lucide-react dropped social brand icons)
const SocialIcons: Record<string, React.FC<{ size: number; className: string }>> = {
  Instagram: ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Facebook: ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  LinkedIn: ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  YouTube: ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

const SOCIAL = [
  { key: "Instagram", href: "#", label: "Instagram" },
  { key: "Facebook",  href: "#", label: "Facebook" },
  { key: "LinkedIn",  href: "#", label: "LinkedIn" },
  { key: "YouTube",   href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-black-deep">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <p
                className="text-[1.2rem] font-semibold tracking-[0.22em] text-smoke uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Deccan
              </p>
              <p
                className="text-[0.6rem] tracking-[0.38em] text-gold uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Harvests
              </p>
            </div>
            <p
              className="text-[0.8rem] text-white/35 leading-relaxed max-w-[220px]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Bringing the finest spices from India to the world with quality,
              integrity and trust.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL.map(({ key, href, label }) => {
                const Icon = SocialIcons[key];
                return (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:text-gold hover:border-gold/30 transition-colors duration-200"
                  >
                    <Icon size={13} className="" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p
              className="text-[0.65rem] tracking-[0.18em] text-white/30 uppercase mb-5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.8rem] text-white/40 hover:text-white/70 transition-colors duration-200"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p
              className="text-[0.65rem] tracking-[0.18em] text-white/30 uppercase mb-5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.8rem] text-white/40 hover:text-white/70 transition-colors duration-200"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-[0.65rem] tracking-[0.18em] text-white/30 uppercase mb-5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Contact
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "+91 98765 43210",
                "exports@deccanharvests.com",
                "Guntur, Andhra Pradesh, India — 522 001",
              ].map((item) => (
                <li
                  key={item}
                  className="text-[0.78rem] text-white/35 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[0.7rem] text-white/20"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            © 2024 Deccan Harvests — Mulukutla Exports Pvt. Ltd. All rights reserved.
          </p>
          <p
            className="text-[0.7rem] text-white/15 tracking-[0.06em]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Guntur · Andhra Pradesh · India
          </p>
        </div>
      </div>
    </footer>
  );
}
