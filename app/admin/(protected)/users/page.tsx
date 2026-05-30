import { authFetch } from "@/lib/auth";
import { formatDisplayDate } from "@/lib/utils";
import type { AdminUser } from "@/lib/types";

const ROLE_COLORS: Record<string, string> = {
  ADMIN:   "text-gold bg-gold/10 border-gold/20",
  MANAGER: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  VIEWER:  "text-white/40 bg-white/5 border-white/10",
};

export default async function UsersAdminPage() {
  const users = await authFetch<AdminUser[]>("/api/v1/users") ?? [];

  return (
    <div>
      <h1
        className="text-[1.4rem] font-normal text-smoke mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Users
        <span className="ml-3 text-[0.75rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
          {users.length} total
        </span>
      </h1>

      <div className="border border-white/8">
        {users.length === 0 ? (
          <p className="p-8 text-center text-[0.82rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
            No users yet.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Email", "Role", "Status", "Created"].map((h) => (
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
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-[0.8rem] text-smoke" style={{ fontFamily: "var(--font-inter)" }}>
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-[0.78rem] text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[0.58rem] tracking-widest uppercase border rounded-sm ${ROLE_COLORS[user.role]}`}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[0.72rem] ${user.isActive ? "text-green-400" : "text-white/30"}`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[0.72rem] text-white/30" style={{ fontFamily: "var(--font-inter)" }}>
                    {formatDisplayDate(user.createdAt)}
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
