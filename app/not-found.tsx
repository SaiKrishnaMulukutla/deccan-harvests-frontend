import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black-deep flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[0.62rem] tracking-[0.22em] text-gold/60 uppercase mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Deccan Harvests
      </p>

      <span
        className="text-[clamp(6rem,16vw,12rem)] font-light text-white/[0.04] leading-none select-none mb-0"
        style={{ fontFamily: "var(--font-cormorant)" }}
        aria-hidden
      >
        404
      </span>

      <h1
        className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-smoke leading-tight -mt-4 mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        This Page Doesn&apos;t Exist
      </h1>

      <p
        className="text-[0.88rem] text-white/40 max-w-sm leading-relaxed mb-10"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        The page you&apos;re looking for has moved, been removed, or may never have existed.
        Let&apos;s find your way back.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-7 py-3.5 bg-gold text-black-deep text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-gold-light transition-colors duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="px-7 py-3.5 border border-white/20 text-white/60 text-[0.72rem] tracking-[0.12em] uppercase hover:border-white/40 hover:text-white/80 transition-colors duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Browse Products
        </Link>
      </div>

      <div className="mt-20 w-px h-12 bg-gold/20" aria-hidden />
    </main>
  );
}
