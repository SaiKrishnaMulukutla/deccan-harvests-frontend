"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// Curated Pexels images — chilli, spices, agriculture, shipping
const GALLERY = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Red chilli harvest in baskets",
    caption: "Guntur Harvest",
    tall: true,
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/6220707/pexels-photo-6220707.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Turmeric powder macro",
    caption: "Golden Turmeric",
    tall: false,
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/4198417/pexels-photo-4198417.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Spices in bowls",
    caption: "Spice Selection",
    tall: false,
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Coffee beans macro",
    caption: "Premium Coffee",
    tall: true,
  },
  {
    id: 5,
    src: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Chilli peppers close up",
    caption: "Teja Variety",
    tall: false,
  },
  {
    id: 6,
    src: "https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Aerial view of farm fields",
    caption: "Andhra Fields",
    tall: false,
  },
  {
    id: 7,
    src: "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Shipping containers at port",
    caption: "Global Shipping",
    tall: true,
  },
  {
    id: 8,
    src: "https://images.pexels.com/photos/6220710/pexels-photo-6220710.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Turmeric powder close-up",
    caption: "Quality Grind",
    tall: false,
  },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="gallery" className="bg-black-deep py-24 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-3">Gallery</p>
            <h2
              className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-normal text-smoke leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Fields, Facilities<br />& Beyond
            </h2>
          </motion.div>
        </div>

        {/* Masonry-style grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          style={{ gridAutoRows: "220px" }}
        >
          {GALLERY.map(({ id, src, alt, caption, tall }, i) => (
            <motion.div
              key={id}
              className={`relative overflow-hidden group cursor-pointer ${tall ? "row-span-2" : "row-span-1"}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                <p
                  className="text-[0.7rem] text-white/80 tracking-[0.1em] uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {caption}
                </p>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 border border-transparent group-hover:border-gold/25 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
