"use client";

import { useRef, useLayoutEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Sprout, SlidersHorizontal, Sun, FlaskConical, BoxSelect, Ship } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Sprout,
    title: "Farming",
    description: "Carefully cultivated by expert local farmers in Guntur's fertile soil.",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Sorting",
    description: "Handpicked and sorted for consistent quality and uniform grade.",
  },
  {
    number: "03",
    icon: Sun,
    title: "Drying",
    description: "Sun-dried to retain purity, colour intensity and natural oils.",
  },
  {
    number: "04",
    icon: FlaskConical,
    title: "Quality Testing",
    description: "Lab-tested against international food safety standards.",
  },
  {
    number: "05",
    icon: BoxSelect,
    title: "Packaging",
    description: "Hygienic packaging designed to lock in freshness for global transit.",
  },
  {
    number: "06",
    icon: Ship,
    title: "Shipping",
    description: "Delivered safely to ports worldwide with full documentation.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!lineRef.current || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1.5,
        },
      });

      gsap.set(lineRef.current, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      tl.to(lineRef.current, { strokeDashoffset: 0, ease: "none" });
    };

    initGSAP();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-black-rich py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">

          {/* ── Left: Steps ── */}
          <div className="lg:col-span-3">
            <motion.p
              className="section-label mb-5"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              Our Process
            </motion.p>

            <motion.h2
              className="text-[clamp(2rem,4vw,3rem)] font-normal text-smoke leading-[1.1] mb-14"
              style={{ fontFamily: "var(--font-playfair)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              From Farm to World<br />With Care
            </motion.h2>

            {/* Connecting line SVG */}
            <div className="relative mb-4">
              <svg
                className="absolute top-5 left-5 hidden lg:block"
                width="100%"
                height="2"
                style={{ overflow: "visible" }}
              >
                <line
                  ref={lineRef}
                  x1="0" y1="1" x2="100%" y2="1"
                  stroke="#C9A84C"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              </svg>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
                {STEPS.map(({ number, icon: Icon, title, description }, i) => (
                  <motion.div
                    key={number}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 bg-black-deep">
                        <Icon size={16} className="text-gold" strokeWidth={1.5} />
                      </div>
                      <span
                        className="text-[0.65rem] text-gold/50 tracking-[0.15em] uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {number}
                      </span>
                    </div>
                    <h3
                      className="text-[0.9rem] font-medium text-smoke mb-1.5 uppercase tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-[0.76rem] text-white/40 leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Cinematic Image ── */}
          <motion.div
            className="lg:col-span-2 relative h-64 lg:h-full min-h-[420px] overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="https://images.pexels.com/photos/3827839/pexels-photo-3827839.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Shipping port — global export operations"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-rich/80 via-transparent to-transparent" />

            {/* Label overlay */}
            <div className="absolute bottom-6 left-6">
              <p
                className="text-[0.65rem] text-gold/60 tracking-[0.18em] uppercase mb-1"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Mulukutla Exports
              </p>
              <p
                className="text-[1.1rem] text-white/80 font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Global Shipping Operations
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
