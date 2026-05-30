// Login page bypasses the admin auth gate — it has its own minimal layout.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
