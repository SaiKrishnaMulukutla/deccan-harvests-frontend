import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { deriveProductCategory } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://deccanharvests.com";

export const metadata = {
  title: "Our Products — Deccan Harvests",
  description:
    "Browse our full range of premium Guntur chilli varieties, turmeric, coffee and spice powders. Certified, consistent and export-ready.",
  openGraph: {
    title: "Our Products — Deccan Harvests",
    description: "Premium Guntur chilli, turmeric, coffee and spice exports. Certified and export-ready.",
    type: "website",
    url: `${BASE_URL}/products`,
    siteName: "Deccan Harvests",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "All" } = await searchParams;
  const products = await apiFetch<Product[]>("/api/v1/products", { revalidate: 3600 }) ?? [];

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => deriveProductCategory(p.slug) === category);

  return (
    <main className="min-h-screen bg-black-deep">
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="pt-40 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <p className="section-label mb-4">Our Products</p>
        <h1
          className="text-[clamp(2.5rem,6vw,5rem)] font-light text-smoke leading-tight max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Premium Spices,<br />Sourced at Origin
        </h1>
        <p
          className="mt-5 text-[0.9rem] text-white/50 max-w-lg leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Every product is tested, certified and traceable back to its farm.
          Available in whole, powder and custom-blend formats.
        </p>
      </section>

      {/* ── Filter Bar ── */}
      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto mb-12">
        <div className="flex flex-wrap gap-2.5">
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = cat === category || (cat === "All" && category === "All");
            return (
              <Link
                key={cat}
                href={cat === "All" ? "/products" : `/products?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 text-[0.72rem] tracking-[0.1em] uppercase border transition-colors duration-200 ${
                  active
                    ? "border-gold bg-gold text-black-deep"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto pb-32">
        {filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-6 text-center">
            <p
              className="text-[0.9rem] text-white/40"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              No products found in this category yet.
            </p>
            <Link href="/contact" className="link-gold">
              Request a Custom Quote →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filtered.map((product) => {
              const imageUrl = product.images[0]?.url;
              const shuLabel =
                product.shuMin && product.shuMax
                  ? `${product.shuMin.toLocaleString()}–${product.shuMax.toLocaleString()} SHU`
                  : null;

              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden mb-5">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-black-rich" />
                    )}
                    <div className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black-deep/70 border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={13} className="text-gold" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2
                        className="text-[1.05rem] font-normal text-smoke group-hover:text-gold transition-colors duration-200 mb-1"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {product.name}
                      </h2>
                      {product.variety && (
                        <p
                          className="text-[0.7rem] text-white/40 uppercase tracking-[0.07em] mb-2"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {product.variety}
                        </p>
                      )}
                      <p
                        className="text-[0.82rem] text-white/50 leading-relaxed line-clamp-2"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Spec pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {shuLabel && (
                      <span
                        className="px-2.5 py-1 text-[0.65rem] tracking-[0.06em] border border-white/10 text-white/40 uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {shuLabel}
                      </span>
                    )}
                    {product.astaValue && (
                      <span
                        className="px-2.5 py-1 text-[0.65rem] tracking-[0.06em] border border-gold/20 text-gold/60 uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {product.astaValue}
                      </span>
                    )}
                    {product.moisture && (
                      <span
                        className="px-2.5 py-1 text-[0.65rem] tracking-[0.06em] border border-white/10 text-white/40 uppercase"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {product.moisture}
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-4 text-[0.72rem] text-gold tracking-[0.08em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    View Details →
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
