"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/4198417/pexels-photo-4198417.jpeg?auto=compress&cs=tinysrgb&w=600";

function getDetail(p: Product): string {
  if (p.variety && p.shuMin && p.shuMax) {
    return `${p.variety} · ${p.shuMin.toLocaleString()}–${p.shuMax.toLocaleString()} SHU`;
  }
  if (p.variety) return p.variety;
  if (p.astaValue) return p.astaValue;
  return "Premium quality";
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Products({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="products" className="bg-black-deep py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              className="section-label mb-4"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              Our Products
            </motion.p>
            <motion.h2
              className="text-[clamp(2rem,4vw,3rem)] font-normal text-smoke leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Premium Quality,<br />Naturally
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/products" className="link-gold hidden sm:flex">
              View All Products →
            </Link>
          </motion.div>
        </div>

        {/* Card Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {products.map((product) => (
            <motion.div key={product.slug} variants={card}>
              <Link href={`/products/${product.slug}`} className="group block">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden mb-4">
                  <Image
                    src={product.images[0]?.url ?? FALLBACK_IMAGE}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition-colors duration-300" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black-deep/70 border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={13} className="text-gold" />
                  </div>
                </div>

                {/* Info */}
                <h3
                  className="text-[0.95rem] font-normal text-smoke mb-1 group-hover:text-gold transition-colors duration-200"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-[0.75rem] text-white/40 leading-relaxed mb-1.5 line-clamp-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {product.description}
                </p>
                <p
                  className="text-[0.65rem] text-gold/60 tracking-[0.06em] uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {getDetail(product)}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
