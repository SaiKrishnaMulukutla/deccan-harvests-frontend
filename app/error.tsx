"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black-deep flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[0.62rem] tracking-[0.22em] text-gold/60 uppercase mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Deccan Harvests
      </p>

      <span
        className="text-[clamp(6rem,16vw,12rem)] font-light text-white/[0.04] leading-none select-none"
        style={{ fontFamily: "var(--font-cormorant)" }}
        aria-hidden
      >
        500
      </span>

      <h1
        className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-smoke leading-tight -mt-4 mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Something Went Wrong
      </h1>

      <p
        className="text-[0.88rem] text-white/40 max-w-sm leading-relaxed mb-10"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        An unexpected error occurred. Our team has been notified.
        You can try again or return to the homepage.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-7 py-3.5 bg-gold text-black-deep text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-gold-light transition-colors duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-7 py-3.5 border border-white/20 text-white/60 text-[0.72rem] tracking-[0.12em] uppercase hover:border-white/40 hover:text-white/80 transition-colors duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Back to Home
        </Link>
      </div>

      <div className="mt-20 w-px h-12 bg-gold/20" aria-hidden />
    </main>
  );
}
