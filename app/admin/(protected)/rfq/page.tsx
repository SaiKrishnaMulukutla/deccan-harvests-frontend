import Link from "next/link";
import { authFetch } from "@/lib/auth";
import { formatDisplayDate } from "@/lib/utils";
import type { PaginatedResponse, RFQ, RFQStatus } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  NEW:       "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  QUOTED:    "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED:    "text-white/30 bg-white/5 border-white/10",
};

const STATUSES: RFQStatus[] = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];

export default async function RFQListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));
  const params = new URLSearchParams({ limit: "20", page: String(currentPage) });
  if (status) params.set("status", status);

  const result = await authFetch<PaginatedResponse<RFQ>>(`/api/v1/rfq?${params.toString()}`);
  const items = result?.items ?? [];
  const meta  = result?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-smoke mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Requests for Quote
        {meta.total > 0 && (
          <span className="ml-3 text-[0.75rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            {meta.total} total
          </span>
        )}
      </h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/rfq"
          className={`px-3.5 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase border transition-colors ${
            !status ? "border-gold bg-gold/10 text-gold" : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/60"
          }`}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/rfq?status=${s}`}
            className={`px-3.5 py-1.5 text-[0.65rem] tracking-[0.1em] uppercase border transition-colors ${
              status === s ? "border-gold bg-gold/10 text-gold" : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/60"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="border border-white/8">
        {items.length === 0 ? (
          <p className="p-8 text-center text-[0.82rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            No requests found.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {["Buyer", "Product", "Quantity", "Country", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.6rem] tracking-[0.12em] text-white/25 uppercase font-normal"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((rfq) => (
                <tr key={rfq.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/rfq/${rfq.id}`}
                      className="text-[0.8rem] text-smoke hover:text-gold transition-colors block"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {rfq.name}
                    </Link>
                    <p className="text-[0.68rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
                      {rfq.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                    {rfq.product}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                    {rfq.quantity}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                    {rfq.country}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[0.58rem] tracking-widest uppercase border rounded-sm ${STATUS_COLORS[rfq.status]}`}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {rfq.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.72rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
                    {formatDisplayDate(rfq.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[0.7rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            {meta.page > 1 && (
              <Link
                href={`/admin/rfq?${status ? `status=${status}&` : ""}page=${meta.page - 1}`}
                className="px-3 py-1.5 text-[0.65rem] border border-white/15 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                ← Prev
              </Link>
            )}
            {meta.page < meta.totalPages && (
              <Link
                href={`/admin/rfq?${status ? `status=${status}&` : ""}page=${meta.page + 1}`}
                className="px-3 py-1.5 text-[0.65rem] border border-white/15 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
