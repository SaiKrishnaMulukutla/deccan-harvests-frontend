import { requireAuth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin — Deccan Harvests" };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return <AdminShell user={user}>{children}</AdminShell>;
}
