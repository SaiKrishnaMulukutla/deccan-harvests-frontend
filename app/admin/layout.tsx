// Root admin layout is a passthrough.
// Auth gate lives in app/admin/(protected)/layout.tsx so the
// login page at /admin/login is NOT behind the auth check.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
