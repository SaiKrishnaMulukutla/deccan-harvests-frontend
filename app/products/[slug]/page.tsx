import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { getProductFormats } from "@/lib/utils";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  const products = await apiFetch<Product[]>("/api/v1/products", { revalidate: 3600 }) ?? [];
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await apiFetch<Product>(`/api/v1/products/slug/${slug}`, { revalidate: 3600 });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `Premium ${product.name} exported from Guntur, India.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    apiFetch<Product>(`/api/v1/products/slug/${slug}`, { revalidate: 3600 }),
    apiFetch<Product[]>("/api/v1/products", { revalidate: 3600 }),
  ]);

  if (!product) notFound();

  const imageUrl = product.images[0]?.url;
  const related = (allProducts ?? []).filter((p) => p.slug !== slug).slice(0, 3);
  const formats = getProductFormats(slug);

  const specs: { label: string; value: string }[] = [
    product.variety   ? { label: "Variety",            value: product.variety } : null,
    product.shuMin && product.shuMax
      ? { label: "SHU Range",          value: `${product.shuMin.toLocaleString()} – ${product.shuMax.toLocaleString()}` }
      : null,
    product.astaValue ? { label: "ASTA Colour Value",  value: product.astaValue } : null,
    product.moisture  ? { label: "Moisture",           value: product.moisture }  : null,
    { label: "Available Formats",  value: formats.join(", ") },
    { label: "Certifications",     value: "ISO 22000, HACCP, APEDA, Spices Board" },
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <main className="bg-black-deep min-h-screen">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10" aria-label="Breadcrumb">
          <Link
            href="/products"
            className="text-[0.72rem] text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Products
          </Link>
          <span className="text-white/20 text-xs">→</span>
          <span
            className="text-[0.72rem] text-gold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {product.name}
          </span>
        </nav>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16">

          {/* Left: Image */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full bg-black-rich" />
              )}
              <div className="absolute inset-0 border border-gold/10" />
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {product.variety && (
              <p className="section-label mb-3">{product.variety}</p>
            )}
            <h1
              className="text-[clamp(2rem,4vw,3.2rem)] font-normal text-smoke leading-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p
                className="text-[0.88rem] text-white/60 leading-relaxed mb-10"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {product.description}
              </p>
            )}

            {/* Spec Table */}
            <div className="border border-white/10 mb-8">
              {specs.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 px-5 py-3.5 ${i < specs.length - 1 ? "border-b border-white/10" : ""}`}
                >
                  <span
                    className="text-[0.68rem] text-white/40 uppercase tracking-[0.1em] w-36 flex-shrink-0 pt-0.5"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[0.83rem] text-smoke/80"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gold text-black-deep text-[0.75rem] font-semibold tracking-[0.1em] uppercase hover:bg-gold-light transition-colors duration-300"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Request a Quote →
              </Link>
              <Link
                href="/quality"
                className="flex items-center justify-center gap-2 px-5 py-4 border border-white/20 text-white/60 text-[0.72rem] tracking-[0.1em] uppercase hover:border-white/40 hover:text-white/80 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                View Certifications
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-24">
            <p className="section-label mb-8">You May Also Like</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => {
                const img = p.images[0]?.url;
                return (
                  <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden mb-4">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-black-rich" />
                      )}
                      <div className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors duration-300" />
                      <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black-deep/70 border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight size={11} className="text-gold" />
                      </div>
                    </div>
                    <h3
                      className="text-[0.92rem] font-normal text-smoke group-hover:text-gold transition-colors duration-200"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {p.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-black-deep/95 backdrop-blur border-t border-white/10 px-4 py-3 flex items-center justify-between">
        <span
          className="text-[0.82rem] text-smoke font-normal"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {product.name}
        </span>
        <Link
          href={`/contact?product=${encodeURIComponent(product.name)}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-gold text-black-deep text-[0.68rem] font-semibold tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Get a Quote →
        </Link>
      </div>

      <Footer />
    </main>
  );
}
