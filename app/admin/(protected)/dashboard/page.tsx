import Link from "next/link";
import { authFetch } from "@/lib/auth";
import { formatDisplayDate } from "@/lib/utils";
import type { PaginatedResponse, RFQ } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  NEW:       "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  QUOTED:    "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED:    "text-white/30 bg-white/5 border-white/10",
};

export default async function DashboardPage() {
  const result = await authFetch<PaginatedResponse<RFQ>>("/api/v1/rfq?limit=10&page=1");
  const recent = result?.items ?? [];
  const total  = result?.meta.total ?? 0;

  const counts = {
    NEW:       recent.filter((r) => r.status === "NEW").length,
    IN_REVIEW: recent.filter((r) => r.status === "IN_REVIEW").length,
    QUOTED:    recent.filter((r) => r.status === "QUOTED").length,
    CLOSED:    recent.filter((r) => r.status === "CLOSED").length,
  };

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-smoke mb-8"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total RFQs",  value: total,          sub: "all time" },
          { label: "New",         value: counts.NEW,      sub: "awaiting review" },
          { label: "In Review",   value: counts.IN_REVIEW, sub: "being processed" },
          { label: "Quoted",      value: counts.QUOTED,   sub: "awaiting buyer" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="border border-white/8 p-5 bg-black-rich">
            <p
              className="text-[0.62rem] tracking-[0.15em] text-white/30 uppercase mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {label}
            </p>
            <p
              className="text-[2rem] font-light text-smoke leading-none mb-1"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {value}
            </p>
            <p
              className="text-[0.68rem] text-white/25"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent RFQs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-[0.78rem] tracking-[0.1em] text-white/50 uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Recent Requests
          </h2>
          <Link
            href="/admin/rfq"
            className="text-[0.72rem] text-gold hover:text-gold-light transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            View all →
          </Link>
        </div>

        <div className="border border-white/8">
          {recent.length === 0 ? (
            <p className="p-6 text-[0.82rem] text-white/30 text-center" style={{ fontFamily: "var(--font-inter)" }}>
              No requests yet.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8">
                  {["Buyer", "Product", "Country", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[0.62rem] tracking-[0.12em] text-white/25 uppercase font-normal"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((rfq) => (
                  <tr key={rfq.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/rfq/${rfq.id}`}
                        className="text-[0.8rem] text-smoke hover:text-gold transition-colors"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {rfq.name}
                      </Link>
                      <p className="text-[0.68rem] text-white/30 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                        {rfq.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[0.78rem] text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                      {rfq.product}
                    </td>
                    <td className="px-4 py-3 text-[0.78rem] text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                      {rfq.country}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[0.6rem] tracking-widest uppercase border rounded-sm ${STATUS_COLORS[rfq.status]}`}
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
      </div>
    </div>
  );
}
