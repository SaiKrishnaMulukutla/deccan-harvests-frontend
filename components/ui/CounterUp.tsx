"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

interface CounterUpProps {
  to: number;
  suffix?: string;
  duration?: number;
}

export function CounterUp({ to, suffix = "+", duration = 2.2 }: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // negative bottom margin so the counter fires before it fully enters viewport
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    // hard fallback: if the observer fires but Lenis causes the animation to stall, force the final value
    const fail = setTimeout(() => mv.set(to), (duration + 0.5) * 1000);
    return () => {
      controls.stop();
      clearTimeout(fail);
    };
  }, [inView, to, duration, mv]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
