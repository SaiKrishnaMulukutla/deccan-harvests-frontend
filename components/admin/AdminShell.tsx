"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Package, Users, Mail, Radio, LogOut, ExternalLink } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { clientFetch } from "@/lib/api";

const NAV = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/rfq",          label: "RFQs",         icon: FileText },
  { href: "/admin/products",     label: "Products",     icon: Package },
  { href: "/admin/users",        label: "Users",        icon: Users },
  { href: "/admin/subscribers",  label: "Subscribers",  icon: Mail },
  { href: "/admin/broadcast",    label: "Broadcast",    icon: Radio },
];

export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await clientFetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Cookie already cleared or session expired — proceed to redirect
    }
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-black-deep">
      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 flex flex-col bg-black-rich border-r border-white/6">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/6">
          <p
            className="text-[0.65rem] tracking-[0.2em] text-white/30 uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Deccan Harvests
          </p>
          <p
            className="text-[0.7rem] tracking-[0.12em] text-gold uppercase mt-0.5"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm mb-0.5 text-[0.78rem] transition-colors duration-150 ${
                  active
                    ? "bg-gold/8 text-gold border-l-2 border-gold pl-[10px]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/4 border-l-2 border-transparent"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/6 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-[0.72rem] text-white/25 hover:text-white/50 transition-colors duration-150 rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <ExternalLink size={12} strokeWidth={1.5} />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-[0.72rem] text-white/25 hover:text-red-400 transition-colors duration-150 rounded-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <LogOut size={12} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-12 border-b border-white/6 flex items-center justify-end px-6">
          <span
            className="text-[0.72rem] text-white/30"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {user.email}
            <span className="ml-2 px-1.5 py-0.5 text-[0.58rem] tracking-widest uppercase border border-white/10 text-white/20 rounded-sm">
              {user.role}
            </span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
