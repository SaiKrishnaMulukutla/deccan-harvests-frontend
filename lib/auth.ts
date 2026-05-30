import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Server-side fetch that forwards the browser's cookies to the backend.
 * Use in Server Components and Server Actions only.
 * Returns null on 401, 403, or network errors.
 */
export async function authFetch<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Returns the current session user, or null if not authenticated. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const data = await authFetch<{ user: SessionUser }>("/api/v1/auth/me");
  return data?.user ?? null;
}

/**
 * Guards a Server Component — redirects to /admin/login if not authenticated.
 * Returns the current user when auth is valid.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
