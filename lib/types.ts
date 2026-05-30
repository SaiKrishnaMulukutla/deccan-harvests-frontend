// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface ProductImage {
  url: string;
}

export type ProductStatus = "ACTIVE" | "INACTIVE" | "SEASONAL";

export interface Product {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  variety: string | null;
  shuMin: number | null;
  shuMax: number | null;
  astaValue: string | null;
  moisture: string | null;
  description: string | null;
  images: ProductImage[];
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  certNumber: string | null;
  issuedAt: string;
  expiresAt: string | null;
  fileUrl: string;
  active: boolean;
}

// ── Admin types ───────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "MANAGER" | "VIEWER";
export type RFQStatus = "NEW" | "IN_REVIEW" | "QUOTED" | "CLOSED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RFQ {
  id: string;
  name: string;
  email: string;
  country: string;
  product: string;
  quantity: string;
  message: string | null;
  status: RFQStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  country: string | null;
  isActive: boolean;
  subscribedAt: string;
}
