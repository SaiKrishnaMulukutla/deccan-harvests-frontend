"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Mercator projection: viewBox 800×420, lat range ~72°N to −60°S
// x = (lon + 180) / 360 * 800
// y = (merc_N - ln(tan(π/4 + lat·π/360))) / merc_range * 420
// merc_N = ln(tan(π/4 + 72·π/360)) ≈ 1.843
// merc_range ≈ 3.160  (72°N to 60°S)
const LOCATIONS = [
  { id: "guntur",  label: "Guntur, India",   x: 578, y: 207, primary: true,  labelAbove: true  },
  { id: "dubai",   label: "Dubai, UAE",       x: 523, y: 185, primary: false, labelAbove: false },
  { id: "london",  label: "London, UK",       x: 400, y: 105, primary: false, labelAbove: false },
  { id: "germany", label: "Frankfurt",        x: 419, y: 110, primary: false, labelAbove: true  }, // above to avoid London overlap
  { id: "singap",  label: "Singapore",        x: 630, y: 241, primary: false, labelAbove: false },
  { id: "sydney",  label: "Sydney, AU",       x: 736, y: 329, primary: false, labelAbove: true  },
  { id: "tokyo",   label: "Tokyo, Japan",     x: 711, y: 163, primary: false, labelAbove: true  },
  { id: "newyork", label: "New York, USA",    x: 236, y: 144, primary: false, labelAbove: true  },
  { id: "saopaulo",label: "São Paulo",        x: 296, y: 302, primary: false, labelAbove: false },
];

// Simplified continent outlines — equirectangular projection for decorative fills
// All paths use x=(lon+180)/360*800, y=(90-lat)/180*420
const CONTINENTS = [
  // North America
  "M33,70 L56,42 L111,82 L133,128 L156,145 L200,175 L216,187 L233,152 L256,107 L267,100 L284,82 L278,65 L249,42 L222,23 L178,23 L111,42 Z",
  // South America
  "M222,191 L262,187 L322,222 L322,258 L293,272 L256,338 L249,331 L222,222 Z",
  // Europe
  "M378,123 L378,110 L389,98 L393,89 L389,75 L411,82 L433,77 L456,58 L467,58 L471,105 L462,117 L444,121 L422,124 L400,126 L389,126 Z",
  // Africa
  "M362,175 L389,129 L422,124 L456,124 L482,140 L511,182 L493,184 L478,292 L440,292 L418,222 L389,210 L367,198 Z",
  // Asia (mainland, rough)
  "M467,105 L500,124 L522,157 L551,157 L578,147 L622,163 L633,198 L667,175 L711,128 L722,105 L756,70 L711,42 L600,42 L533,58 L467,70 Z",
  // India peninsula
  "M551,157 L578,147 L578,191 L571,198 L556,191 L551,180 Z",
  // Australia
  "M656,292 L700,245 L722,250 L740,272 L740,298 L711,298 L689,287 L671,289 Z",
];

function buildArc(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

export default function Origin() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [origin, ...destinations] = LOCATIONS;

  return (
    <section
      ref={sectionRef}
      id="origin"
      className="bg-ivory"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">

        {/* ── Left: Text + Image ── */}
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-20">
          <motion.p
            className="section-label mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Origin
          </motion.p>

          <motion.h2
            className="text-[clamp(2.2rem,4vw,3.2rem)] font-normal leading-[1.1] text-black-deep mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Rooted in Guntur,<br />Trusted Worldwide
          </motion.h2>

          <motion.p
            className="text-[0.92rem] text-muted leading-[1.8] max-w-sm mb-8"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            The fertile soil and perfect climate of Guntur give our chillies their rich
            colour, intense aroma and unmatched pungency. A legacy of quality passed
            down for generations, now reaching tables around the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/about" className="link-gold">
              Discover Our Origin →
            </Link>
          </motion.div>

          {/* Chilli basket image */}
          <motion.div
            className="relative mt-10 h-52 w-full max-w-xs overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="https://images.pexels.com/photos/4198417/pexels-photo-4198417.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Guntur chilli harvest"
              fill
              className="object-cover"
              sizes="400px"
            />
          </motion.div>
        </div>

        {/* ── Right: World Map ── */}
        <div className="relative flex flex-col items-center justify-center bg-black-rich px-6 py-16 lg:py-0">
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg
              viewBox="0 0 800 420"
              className="w-full"
              preserveAspectRatio="xMidYMid meet"
              aria-label="World export map showing key destinations from Guntur, India"
            >
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="rgba(201,168,76,0.12)" />
                </pattern>
                <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Dot-grid background */}
              <rect width="800" height="420" fill="url(#dots)" />

              {/* Continent silhouettes — decorative gold fills */}
              {CONTINENTS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="rgba(201,168,76,0.07)"
                  stroke="rgba(201,168,76,0.15)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Animated arc lines from Guntur to each destination */}
              {destinations.map((dest, i) => (
                <motion.path
                  key={dest.id}
                  d={buildArc(origin.x, origin.y, dest.x, dest.y)}
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{
                    duration: 1.4,
                    delay: 0.8 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}

              {/* Destination dots + labels */}
              {destinations.map((dest, i) => (
                <motion.g
                  key={dest.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.8 + i * 0.1 }}
                  style={{ transformOrigin: `${dest.x}px ${dest.y}px` }}
                >
                  <circle cx={dest.x} cy={dest.y} r="3" fill="#C9A84C" opacity="0.75" />
                  <text
                    x={dest.x}
                    y={dest.labelAbove ? dest.y - 8 : dest.y + 13}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="6.5"
                    fontFamily="var(--font-space-grotesk)"
                    letterSpacing="0.07em"
                  >
                    {dest.label}
                  </text>
                </motion.g>
              ))}

              {/* Guntur origin — pulsing */}
              <motion.circle
                cx={origin.x} cy={origin.y} r="18"
                fill="url(#pulseGrad)"
                animate={inView ? { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
              />
              <circle cx={origin.x} cy={origin.y} r="5" fill="#C9A84C" />
              <circle cx={origin.x} cy={origin.y} r="2.5" fill="#FAFAF8" />
              <text
                x={origin.x} y={origin.y - 12}
                textAnchor="middle"
                fill="#C9A84C"
                fontSize="7.5"
                fontFamily="var(--font-space-grotesk)"
                letterSpacing="0.1em"
                fontWeight="500"
              >
                {origin.label}
              </text>
            </svg>
          </motion.div>

          <motion.p
            className="mt-6 text-center text-white/50 text-[0.8rem] tracking-[0.05em]"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            Key export hubs ·{" "}
            <span className="text-gold font-medium">20+ countries</span>{" "}
            served worldwide
          </motion.p>
        </div>
      </div>
    </section>
  );
}
