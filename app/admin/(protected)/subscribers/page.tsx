import { authFetch } from "@/lib/auth";
import { formatDisplayDate } from "@/lib/utils";
import type { Subscriber } from "@/lib/types";

export default async function SubscribersAdminPage() {
  const subscribers = await authFetch<Subscriber[]>("/api/v1/subscribers") ?? [];

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-smoke mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Subscribers
        <span className="ml-3 text-[0.75rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
          {subscribers.length} active
        </span>
      </h1>

      <div className="border border-white/8">
        {subscribers.length === 0 ? (
          <p className="p-8 text-center text-[0.82rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            No subscribers yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {["Email", "Name", "Country", "Subscribed"].map((h) => (
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
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-[0.8rem] text-smoke" style={{ fontFamily: "var(--font-inter)" }}>
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
                    {sub.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
                    {sub.country ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[0.72rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
                    {formatDisplayDate(sub.subscribedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
