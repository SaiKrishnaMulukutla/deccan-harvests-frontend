"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Package, Users, CalendarDays } from "lucide-react";

const STATS = [
  { icon: Globe,        value: 20,   suffix: "+", label: "Countries Exported",  subLabel: "Across 4 continents" },
  { icon: Package,      value: 1000, suffix: "+", label: "Tons Delivered",       subLabel: "Every year" },
  { icon: Users,        value: 50,   suffix: "+", label: "Global Partners",      subLabel: "Active relationships" },
  { icon: CalendarDays, value: 15,   suffix: "+", label: "Years Experience",     subLabel: "Since 2009" },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-ivory py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map(({ icon: Icon, value, suffix, label, subLabel }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center text-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon
                size={22}
                className="text-gold/70 mb-5"
                strokeWidth={1.2}
              />
              <p
                className="text-[clamp(3rem,6vw,5rem)] font-light leading-none text-gold mb-3 tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                <CountUp target={value} suffix={suffix} active={inView} />
              </p>
              <p
                className="text-[0.78rem] font-medium text-black-deep tracking-[0.06em] mb-1 uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {label}
              </p>
              <p
                className="text-[0.72rem] text-muted"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {subLabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
