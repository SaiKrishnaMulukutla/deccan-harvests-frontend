"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch, ApiError } from "@/lib/api";
import type { RFQStatus } from "@/lib/types";

const STATUS_FLOW: RFQStatus[] = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];
const STATUS_COLORS: Record<string, string> = {
  NEW:       "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  QUOTED:    "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED:    "text-white/30 bg-white/5 border-white/10",
};

export default function RFQStatusForm({
  rfqId,
  current,
}: {
  rfqId: string;
  current: RFQStatus;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (next: RFQStatus) => {
    setUpdating(true);
    setError(null);
    try {
      await clientFetch(`/api/v1/rfq/${rfqId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Status update failed.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <p
        className="text-[0.62rem] tracking-[0.15em] text-white/30 uppercase mb-3"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Update Status
      </p>
      <div className="flex flex-wrap gap-2">
        {STATUS_FLOW.map((s) => {
          const isActive = s === current;
          const isForward = STATUS_FLOW.indexOf(s) > STATUS_FLOW.indexOf(current);
          return (
            <button
              key={s}
              disabled={updating || isActive || !isForward}
              onClick={() => handleUpdate(s)}
              className={`px-4 py-2 text-[0.65rem] tracking-[0.1em] uppercase border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? `${STATUS_COLORS[s]} cursor-default`
                  : "border-white/15 text-white/40 hover:border-gold/40 hover:text-gold"
              }`}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {updating && isForward ? "…" : s.replace("_", " ")}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-[0.72rem] text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
      <p className="mt-3 text-[0.65rem] text-white/20" style={{ fontFamily: "var(--font-inter)" }}>
        Buyer is emailed automatically on each status change.
      </p>
    </div>
  );
}
