"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Approximate Mercator coordinates in a 800×420 viewBox
const LOCATIONS = [
  { id: "guntur", label: "Guntur, India", x: 538, y: 178, primary: true },
  { id: "dubai",  label: "Dubai, UAE",    x: 480, y: 188 },
  { id: "london", label: "London, UK",    x: 318, y: 108 },
  { id: "newyor", label: "New York, USA", x: 148, y: 148 },
  { id: "singap", label: "Singapore",     x: 605, y: 220 },
  { id: "sydney", label: "Sydney, AU",    x: 660, y: 285 },
  { id: "berlin", label: "Germany",       x: 355, y: 112 },
];

// Bezier arcs from Guntur to each destination
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
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

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
            <div className="absolute inset-0 bg-gradient-to-t from-ivory/60 to-transparent" />
          </motion.div>
        </div>

        {/* ── Right: World Map ── */}
        <div className="relative flex flex-col items-center justify-center bg-black-rich px-6 py-16 lg:py-0">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg
              viewBox="0 0 800 420"
              className="w-full"
              aria-label="World export map from Guntur India"
            >
              {/* Subtle grid dots */}
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="rgba(201,168,76,0.15)" />
                </pattern>
                <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="800" height="420" fill="url(#dots)" />

              {/* Animated arc lines */}
              {destinations.map((dest, i) => (
                <motion.path
                  key={dest.id}
                  d={buildArc(origin.x, origin.y, dest.x, dest.y)}
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{
                    duration: 1.4,
                    delay: 0.8 + i * 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}

              {/* Destination dots */}
              {destinations.map((dest, i) => (
                <motion.g key={dest.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.8 + i * 0.12 }}
                  style={{ transformOrigin: `${dest.x}px ${dest.y}px` }}
                >
                  <circle cx={dest.x} cy={dest.y} r="3.5" fill="#C9A84C" opacity="0.7" />
                  <text
                    x={dest.x}
                    y={dest.y + 14}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.45)"
                    fontSize="7"
                    fontFamily="var(--font-space-grotesk)"
                    letterSpacing="0.08em"
                  >
                    {dest.label}
                  </text>
                </motion.g>
              ))}

              {/* Guntur origin — pulsing */}
              <motion.circle
                cx={origin.x} cy={origin.y} r="16"
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
                fontSize="8"
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
            Exporting to{" "}
            <span className="text-gold font-medium">20+ Countries</span>{" "}
            Across 4 Continents
          </motion.p>
        </div>
      </div>
    </section>
  );
}
