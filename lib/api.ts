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
 * Server-side fetch wrapper (Server Components, Route Handlers).
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

// ── Client-side API ───────────────────────────────────────────────────────────

/** Structured error from the backend, including the request ID for support. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly requestId: string | undefined,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Client-side fetch wrapper (Client Components / form submissions).
 *
 * - Includes cookies on every request (`credentials: 'include'`).
 * - Throws `ApiError` on non-2xx so callers can branch on `status`.
 * - Unwraps the `{ data: T }` response envelope on success.
 */
export async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(apiUrl(path), { ...options, credentials: "include" });
  const json: { data?: T; message?: string; requestId?: string } =
    await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      json.message ?? "Something went wrong. Please try again.",
      json.requestId,
      res.status,
    );
  }

  return (json.data ?? json) as T;
}
