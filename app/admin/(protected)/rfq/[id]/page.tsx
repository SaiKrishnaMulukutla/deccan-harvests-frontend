import Link from "next/link";
import { notFound } from "next/navigation";
import { authFetch } from "@/lib/auth";
import { formatDisplayDate } from "@/lib/utils";
import RFQStatusForm from "@/components/admin/RFQStatusForm";
import type { RFQ } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  NEW:       "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  QUOTED:    "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED:    "text-white/30 bg-white/5 border-white/10",
};

export default async function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfq = await authFetch<RFQ>(`/api/v1/rfq/${id}`);
  if (!rfq) notFound();

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/rfq"
          className="text-[0.7rem] text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          RFQs
        </Link>
        <span className="text-white/15 text-xs">→</span>
        <span
          className="text-[0.7rem] text-gold uppercase tracking-widest"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {rfq.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-[1.4rem] font-normal text-smoke"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {rfq.name}
          </h1>
          <p className="text-[0.78rem] text-white/40 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            {rfq.email} · {rfq.country}
          </p>
        </div>
        <span
          className={`mt-1 px-3 py-1 text-[0.6rem] tracking-widest uppercase border rounded-sm ${STATUS_COLORS[rfq.status]}`}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {rfq.status.replace("_", " ")}
        </span>
      </div>

      {/* Detail rows */}
      <div className="border border-white/8 mb-8">
        {[
          { label: "Product",   value: rfq.product },
          { label: "Quantity",  value: rfq.quantity },
          { label: "Country",   value: rfq.country },
          { label: "Submitted", value: formatDisplayDate(rfq.createdAt) },
          { label: "Updated",   value: formatDisplayDate(rfq.updatedAt) },
        ].map(({ label, value }, i, arr) => (
          <div
            key={label}
            className={`flex items-start gap-8 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-white/6" : ""}`}
          >
            <span
              className="text-[0.65rem] text-white/30 uppercase tracking-[0.1em] w-28 flex-shrink-0 pt-0.5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {label}
            </span>
            <span className="text-[0.82rem] text-smoke/80" style={{ fontFamily: "var(--font-inter)" }}>
              {value}
            </span>
          </div>
        ))}
        {rfq.message && (
          <div className="flex items-start gap-8 px-5 py-3.5 border-t border-white/6">
            <span
              className="text-[0.65rem] text-white/30 uppercase tracking-[0.1em] w-28 flex-shrink-0 pt-0.5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Message
            </span>
            <p
              className="text-[0.82rem] text-smoke/70 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {rfq.message}
            </p>
          </div>
        )}
      </div>

      {/* Status update — client component */}
      {rfq.status !== "CLOSED" && (
        <div className="border border-white/8 p-5">
          <RFQStatusForm rfqId={rfq.id} current={rfq.status} />
        </div>
      )}
    </div>
  );
}
