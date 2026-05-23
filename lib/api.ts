const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Builds a full URL for a given API path. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

interface FetchOptions extends Omit<RequestInit, "next"> {
  /** ISR revalidation interval in seconds. Omit to disable ISR. */
  revalidate?: number;
}

/**
 * Central fetch wrapper for all server-side API calls.
 *
 * - Unwraps the `{ data: T }` response envelope.
 * - Returns `null` on network errors or non-2xx responses (never throws).
 * - Attaches Next.js ISR cache headers when `revalidate` is provided.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { revalidate, ...fetchOptions } = options;

  const nextOptions = revalidate !== undefined
    ? { next: { revalidate } }
    : {};

  try {
    const res = await fetch(apiUrl(path), { ...fetchOptions, ...nextOptions });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}
