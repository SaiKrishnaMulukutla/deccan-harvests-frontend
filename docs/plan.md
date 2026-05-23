# Deccan Harvests — Master Implementation Plan

**Last updated:** 2026-05-23
**Status:** Active. Every engineering decision in this codebase traces back to this document.
**Rule:** If it is not in this plan, discuss before coding. If it is in this plan, follow it without deviation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Layout](#2-repository-layout)
3. [Tech Stack](#3-tech-stack)
4. [Current State](#4-current-state)
5. [Naming Conventions](#5-naming-conventions)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [Coding Standards](#8-coding-standards)
9. [API Contracts](#9-api-contracts)
10. [Known Bugs (Fix Before Launch)](#10-known-bugs-fix-before-launch)
11. [Technical Debt (Prioritized)](#11-technical-debt-prioritized)
12. [Remaining Roadmap](#12-remaining-roadmap)
13. [Environment Variables](#13-environment-variables)
14. [Deployment](#14-deployment)

---

## 1. Project Overview

**Brand:** Deccan Harvests
**Legal entity:** Mulukutla Exports Pvt. Ltd.
**Business:** B2B premium spice exporter — Guntur chilli, turmeric, coffee, spice powders — to 20+ countries.
**Audience:** International importers, wholesalers, distributors placing bulk commodity orders.

**What this system is:**
A public marketing + quote-capture website, a content administration portal, and a backend API — all owned and operated by a single small team indefinitely.

**Core user journeys:**
1. Buyer browses products → views specs → submits RFQ → receives email confirmation.
2. Admin reviews RFQ → updates status → exports quote → marks closed.
3. Admin creates/updates products and certifications via admin portal.

---

## 2. Repository Layout

```
go-classics/
├── deccan-harvests-frontend/    ← Next.js 16 App Router
│   ├── app/                     ← Routes (one folder per route segment)
│   │   ├── (public)/            ← Future route group for public pages
│   │   ├── admin/               ← Admin portal (Phase 7)
│   │   ├── products/
│   │   │   └── [slug]/
│   │   ├── about/
│   │   ├── quality/
│   │   ├── contact/
│   │   ├── exports/
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← Homepage
│   │   ├── not-found.tsx        ← TODO: create
│   │   ├── error.tsx            ← TODO: create
│   │   ├── sitemap.ts           ← TODO: create (Phase 6)
│   │   └── robots.ts            ← TODO: create (Phase 6)
│   ├── components/
│   │   ├── layout/              ← Navbar, Footer
│   │   ├── sections/            ← Homepage-only full-width sections
│   │   ├── ui/                  ← Shared, reusable UI primitives
│   │   └── providers/           ← Context/provider wrappers
│   ├── lib/
│   │   ├── api.ts               ← TODO: central API fetch helper
│   │   ├── constants.ts         ← TODO: shared app-wide constants
│   │   └── utils.ts             ← TODO: pure utility functions
│   └── docs/
│       ├── ROADMAP.md
│       └── plan.md              ← This file
│
└── deccan-harvests-backend/     ← NestJS 11
    ├── src/
    │   ├── auth/
    │   ├── users/
    │   ├── products/
    │   ├── rfq/
    │   ├── certifications/
    │   ├── media/
    │   ├── notifications/
    │   ├── common/              ← Guards, decorators, filters, interceptors, DTOs
    │   ├── config/
    │   ├── database/
    │   └── main.ts
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

---

## 3. Tech Stack

### Frontend

| Concern | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 | Params/searchParams are **Promises** — always `await` them |
| UI | React | 19.2.4 | Server Components by default |
| Styling | Tailwind CSS v4 | 4.x | `@theme` block in `globals.css` — no config file |
| Animation | Framer Motion | 12.x | Use for UI transitions |
| Animation | GSAP + ScrollTrigger | 3.x | Use for scroll-driven animations only |
| Smooth scroll | Lenis | 1.x | Integrated via `SmoothScrollProvider` |
| Forms | React Hook Form + Zod | 7.x + 4.x | Always pair together |
| Icons | lucide-react | 1.x | No brand icons — inline SVG for social |
| HTTP | Native `fetch` | — | Server fetches via `lib/api.ts` |

### Backend

| Concern | Technology | Version | Notes |
|---|---|---|---|
| Framework | NestJS | 11 | DI-first, decorator-driven |
| ORM | Prisma | 5.22 | Schema-first, migrations in `prisma/migrations/` |
| Database | PostgreSQL | — | Via `DATABASE_URL` env var |
| Auth | Passport (JWT + Local) | — | JWT in httpOnly cookies, not Authorization header |
| Password | bcrypt | 6.0 | 12 rounds |
| File storage | AWS S3 | SDK 3.x | Media + cert files |
| Email | Resend | 6.x | Transactional only |
| Validation | class-validator + Zod | — | DTOs use class-validator; config uses Zod |
| Security | Helmet + express-rate-limit | — | Global headers + per-route rate limits |

---

## 4. Current State

### Frontend Pages

| Route | Status | Data Source | Notes |
|---|---|---|---|
| `/` | ✅ Complete | Static + `POST /rfq` | All 10 sections live |
| `/products` | ✅ Built | `GET /products` | Filter by category via URL param |
| `/products/[slug]` | ✅ Built | `GET /products/slug/:slug` | Spec table, related, mobile sticky CTA |
| `/about` | ✅ Built | Static | Founding story, values, metrics |
| `/quality` | ✅ Built | `GET /certifications` | Renewal-pending badge, testing standards |
| `/contact` | ✅ Built | Static + `POST /rfq` | Map embed, FAQ accordion |
| `/exports` | ✅ Built | Static | Markets, Incoterms, capabilities |
| `/admin/*` | ❌ Not started | All admin APIs | Phase 7 |

### Frontend Infrastructure

| Item | Status | Notes |
|---|---|---|
| Design tokens (`globals.css`) | ✅ Complete | Colors, fonts, easings locked |
| Film grain overlay | ✅ Complete | Fixed, `z-9999`, `pointer-events: none` |
| Lenis + GSAP ticker | ✅ Complete | `SmoothScrollProvider` |
| `RFQForm` shared component | ✅ Complete | Used by `/` and `/contact` |
| `lib/api.ts` | ❌ Missing | See §6 — create before next feature |
| `lib/constants.ts` | ❌ Missing | COUNTRIES, PRODUCTS lists duplicated |
| `app/not-found.tsx` | ❌ Missing | Shows default Next.js 404 |
| `app/error.tsx` | ❌ Missing | Unhandled errors show nothing |
| Metadata / sitemap | ❌ Missing | Phase 6 |

### Backend Modules

| Module | Status | Notes |
|---|---|---|
| Auth (login/refresh/logout/me) | ✅ Complete | JWT httpOnly cookies, 15m access / 7d refresh |
| Products (CRUD + public) | ✅ Complete | **Bug:** slug endpoint exposes INACTIVE products |
| RFQ (create + admin CRUD) | ✅ Complete | Fire-and-forget email, no retry |
| Certifications (CRUD + public) | ✅ Complete | **Bug:** expired certs not filtered on public |
| Media (S3 upload/delete) | ✅ Complete | **Bug:** any authed user can delete any file |
| Users (CRUD, soft delete) | ✅ Complete | ADMIN-only |
| Notifications (Resend email) | ✅ Complete | No retry on failure |
| Seed data | ✅ Complete | 8 products + 5 certs via `prisma/seed.ts` |

---

## 5. Naming Conventions

These are non-negotiable. Apply to all new code. Fix violations when you touch an existing file (Boy Scout Rule).

### Files & Folders

```
# React components — PascalCase, single responsibility
components/ui/RFQForm.tsx          ✅
components/sections/ProductCard.tsx ✅
components/ui/rfqForm.tsx           ✗ (wrong case)
components/ui/RFQFormComponent.tsx  ✗ (redundant suffix)

# Route pages — always page.tsx, layout.tsx (Next.js convention)
app/products/page.tsx              ✅
app/products/products-page.tsx     ✗

# Lib modules — camelCase, noun or noun-verb
lib/api.ts                         ✅
lib/constants.ts                   ✅
lib/utils.ts                       ✅
lib/apiHelper.ts                   ✗ (redundant suffix)

# Backend files — NestJS convention: kebab-case.type.ts
src/products/products.service.ts   ✅
src/products/productsService.ts    ✗

# Backend DTOs — kebab-case, prefixed by action
src/rfq/dto/create-rfq.dto.ts      ✅
src/rfq/dto/rfq-create.dto.ts      ✗ (noun before verb)
```

### Variables & Functions

```typescript
// Intent-based naming — name describes WHY, not HOW
const isSubscriptionActive = user.status === 'ACTIVE'  // ✅
const checkStatus = user.status === 'ACTIVE'           // ✗ (describes HOW)

// Boolean variables — prefix with is/has/can/should
const isLoading = true          // ✅
const loading = true            // ✗

// Functions — verb-noun
function getProductBySlug()     // ✅  (fetches → get)
function deriveCategory()       // ✅  (calculates → derive)
function formatDate()           // ✅  (transforms → format)
function buildArc()             // ✅  (constructs → build)
function checkProduct()         // ✗   (what kind of check?)
function productSlug()          // ✗   (not a verb)

// Event handlers — handle prefix
function handleSubmit()         // ✅
function onSubmit()             // ✗ (on is for prop names)

// Async functions — same rules, no async suffix
async function fetchProducts()  // ✅
async function getProducts()    // ✅
async function productsAsync()  // ✗

// Constants — SCREAMING_SNAKE_CASE for true constants, camelCase for config arrays
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  // ✅
const BCRYPT_ROUNDS = 12                       // ✅
const navLinks = [...]                         // ✅ (data array, not a primitive constant)
const NAV_LINKS = [...]                        // acceptable, team preference
```

### React Components

```typescript
// Props interface — ComponentNameProps
interface ProductCardProps { ... }   // ✅
interface Props { ... }              // ✗ (not unique)
interface IProductCard { ... }       // ✗ (Hungarian notation, no)

// No default export anonymous functions
export default function ProductCard() { ... }   // ✅
export default () => { ... }                    // ✗

// One component per file — exceptions allowed only for
// private sub-components used exclusively in the same file
// e.g., InputField inside RFQForm is acceptable
```

### CSS / Tailwind

```
// Never hardcode hex values — always use theme tokens
className="text-gold"              // ✅
style={{ color: '#C9A84C' }}       // ✗

// Never use arbitrary Tailwind values for brand colors
className="text-[#C9A84C]"         // ✗

// Breakpoint order — mobile first, ascending
className="text-sm md:text-base lg:text-lg"  // ✅
className="text-lg md:text-base sm:text-sm"  // ✗
```

---

## 6. Frontend Architecture

### The Golden Rule

> **Server Components by default. Add `"use client"` only when the component needs browser APIs, event handlers, or state.**

```
app/products/page.tsx              → Server Component (fetches data)
components/sections/ProductsGrid.tsx → Client Component (handles filter state)
app/contact/page.tsx               → Client Component (has useState for FAQ)
app/quality/page.tsx               → Server Component (no interactivity)
```

### Data Fetching Pattern

All server-side fetches go through `lib/api.ts`. **Do not call `fetch()` directly in page components.**

```typescript
// lib/api.ts — the single source for all API communication
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { revalidate?: number }
): Promise<T | null> {
  const { revalidate = 3600, ...fetchOptions } = options ?? {};
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...fetchOptions,
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as T;
  } catch {
    return null;
  }
}

// Usage in a Server Component:
const products = await apiFetch<Product[]>('/api/v1/products');
```

**Rules:**
- ISR default: `revalidate: 3600` (1 hour). Override per-call where needed.
- Always return `null` on failure — never throw from `apiFetch`.
- Pages handle `null` gracefully with empty states or fallback content.
- Never use `useEffect` + `fetch` for data that could be server-fetched.

### Shared Constants

All repeated data lives in `lib/constants.ts`. Import from there — never redefine inline.

```typescript
// lib/constants.ts
export const EXPORT_COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', ...
] as const;

export const PRODUCT_CATEGORIES = ['All', 'Chillies', 'Turmeric', 'Coffee', 'Spice Powders'] as const;
export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const RFQ_PRODUCT_OPTIONS = [
  'Teja Chilli (S17)', 'Byadgi Chilli', ...
] as const;
```

### Utility Functions

Pure, stateless functions live in `lib/utils.ts`.

```typescript
// lib/utils.ts
export function deriveProductCategory(slug: string): ProductCategory {
  if (slug.includes('chilli')) return 'Chillies';
  if (slug.includes('turmeric')) return 'Turmeric';
  if (slug.includes('coffee')) return 'Coffee';
  if (slug.includes('powder') || slug.includes('spice') || slug.includes('blend')) return 'Spice Powders';
  return 'All';
}

export function formatDisplayDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function isExpiringWithin(isoString: string | null, days: number): boolean {
  if (!isoString) return false;
  const diff = new Date(isoString).getTime() - Date.now();
  return diff > 0 && diff < days * 24 * 60 * 60 * 1000;
}
```

**Rules:**
- Extract a helper when the same logic appears in 2+ places.
- Pure functions only — no side effects, no API calls.
- Name by what it returns, not what it does internally.

### Component Hierarchy

```
Page (Server Component)
  ├── Navbar (Client — scroll state)
  ├── [Page sections]
  │     ├── Static Section (Server Component)
  │     └── Interactive Section (Client Component)
  │           └── Shared UI primitives (components/ui/)
  └── Footer (Server Component)
```

**Shared UI (`components/ui/`)** — components used in 2+ pages:
- `RFQForm.tsx` ← form logic, used on homepage and `/contact`
- `SectionLabel.tsx` ← TODO: extract the `section-label` + eyebrow pattern
- `SpecTable.tsx` ← TODO: extract from product detail (reused in admin)
- `StatusBadge.tsx` ← TODO: for RFQ status chips in admin portal

**Sections (`components/sections/`)** — homepage-only. Do not import in inner pages.

**Page layouts** — do not create a shared `PageLayout` wrapper. Each page imports `Navbar` + `Footer` directly. This matches the homepage pattern and keeps pages independent.

### Animation Rules (Locked)

- **No bounce easing.** Only `easeOut`, `easeInOut`, `--ease-cinema`, `--ease-smooth`.
- **Min duration:** 300ms. **Max duration:** 1200ms.
- **Scroll animations:** `once: true` + `margin: "-60px"` on `useInView`.
- **Never animate `width` or `height`.** Use `scaleX`/`scaleY` or `clipPath`.
- **GSAP** — only for scroll-driven (ScrollTrigger) animations. Not for hover/click interactions.
- **Framer Motion** — for all mount/unmount transitions and UI state animations.
- Respect `prefers-reduced-motion` — the global CSS rule handles this but GSAP animations need to check it manually.

### Typography Rules (Locked)

```
font-display  (Cormorant Garamond)  → Hero headings, large metric numbers, editorial pull-quotes
font-serif    (Playfair Display)    → Section H2/H3 headings
font-sans     (Inter)               → Body text, descriptions, form inputs, paragraphs
font-grotesk  (Space Grotesk)       → Labels, eyebrows, nav links, button text, tags, captions
```

Never mix roles. A product name is a heading → `font-serif`. A spec label is a tag → `font-grotesk`.

### Missing Infrastructure (Create Before Phase 7)

```
app/not-found.tsx    — 404 page (branded, with home link)
app/error.tsx        — Runtime error boundary page
lib/api.ts           — Central fetch helper (see above)
lib/constants.ts     — EXPORT_COUNTRIES, RFQ_PRODUCT_OPTIONS, PRODUCT_CATEGORIES
lib/utils.ts         — deriveProductCategory, formatDisplayDate, isExpiringWithin
```

---

## 7. Backend Architecture

### Module Pattern

Every feature follows this structure:

```
src/[feature]/
  ├── [feature].module.ts       ← Registers controller, service, exports if needed
  ├── [feature].controller.ts   ← HTTP layer only — maps routes, calls service
  ├── [feature].service.ts      ← All business logic — the only place with Prisma calls
  └── dto/
      ├── create-[feature].dto.ts
      └── update-[feature].dto.ts
```

**Rules:**
- Controllers coordinate (call service methods, map responses). Zero business logic.
- Services execute (contain all logic, DB queries, error handling). Zero HTTP concepts.
- DTOs validate at the boundary. Never trust raw request bodies beyond the DTO.

### Response Shape (Always)

All responses use the global interceptor and filter:

```json
// Success
{ "success": true, "data": <payload> }

// Paginated success
{ "success": true, "data": { "items": [...], "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 } } }

// Error
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Product not found" }, "meta": { "path": "/api/v1/products/slug/bad-slug", "timestamp": "..." } }
```

Never return a raw entity. Never return `{ success: false }` from a controller manually — throw a NestJS `HttpException` and let the filter handle it.

### Guard Chain

```
Request → JwtAuthGuard (all routes)
            ↓ if @Public() → bypass
            ↓ if authenticated → RolesGuard (if @Roles() present)
```

- Routes are **opt-out** of auth via `@Public()`.
- Use `@Roles(Role.ADMIN)` to restrict further.
- `@CurrentUser()` injects the authenticated user from the JWT payload.

### DTO Validation Standards

```typescript
// Strings — always constrain length
@IsString()
@MinLength(2)
@MaxLength(255)
name: string;

// Optional fields — always @IsOptional() first
@IsOptional()
@IsString()
@MaxLength(2000)
description?: string;

// Enums — always @IsEnum()
@IsEnum(ProductStatus)
status: ProductStatus;

// Numbers — always @IsInt() or @IsNumber() + bounds
@IsInt()
@Min(0)
@Max(2_000_000)
shuMin: number;

// Dates — @IsDateString() for ISO strings in DTOs
@IsDateString()
issuedAt: string;

// URLs — @IsUrl() when the field is a URL
@IsUrl()
fileUrl: string;

// Email — @IsEmail() + transform to lowercase in service
@IsEmail()
email: string;
```

### Prisma Rules

- All queries go through `PrismaService` — never instantiate `PrismaClient` directly.
- Select only needed fields in `findMany` queries to avoid over-fetching.
- Use `@db.Text` on long description fields (not VARCHAR).
- Foreign key relationships must use Prisma relation syntax — no loose string IDs for references.
- Every `findUnique` / `findFirst` that can return null must handle the `null` case explicitly.

---

## 8. Coding Standards

### The Hierarchy

1. **Correct first** — it must work, handle errors, handle edge cases.
2. **Readable second** — the next engineer must understand it in 30 seconds.
3. **Simple third** — the fewest moving parts that satisfy 1 and 2.
4. **Efficient last** — optimize only after measuring a bottleneck.

### General Rules

```typescript
// Guard clauses over nested conditions
function getCategory(slug: string): ProductCategory {
  if (slug.includes('chilli')) return 'Chillies';  // ✅ early return
  if (slug.includes('turmeric')) return 'Turmeric';
  if (slug.includes('coffee')) return 'Coffee';
  return 'Spice Powders';
}

// Not this:
function getCategory(slug: string): ProductCategory {
  if (slug.includes('chilli')) {
    return 'Chillies';
  } else {
    if (slug.includes('turmeric')) { ... }  // ✗ deeply nested
  }
}

// Named constants for all magic values
const RENEWAL_THRESHOLD_DAYS = 30;                           // ✅
const isExpiringSoon = isExpiringWithin(cert.expiresAt, 30); // ✗

// No multi-responsibility functions
// Bad: fetchAndRenderProducts() — fetches AND renders
// Good: fetchProducts() + <ProductGrid products={products} />

// Extract when used 2+ times OR when logic is non-obvious
// One instance of deriveCertIcon() is fine if it's complex enough to name
```

### TypeScript Rules

```typescript
// Explicit return types on all exported functions
export async function apiFetch<T>(path: string): Promise<T | null> { ... }  // ✅
export async function apiFetch(path) { ... }  // ✗

// Interface over type alias for object shapes (easier to extend)
interface Product { ... }  // ✅
type Product = { ... }     // ✅ acceptable for unions/intersections

// No type assertions (as) unless unavoidable
const slug = (dto as any).slug;  // ✗
const slug = dto.slug;           // ✅ fix the type properly

// Strict null handling — never assume a value exists
const image = product.images[0]?.url ?? null;  // ✅
const image = product.images[0].url;           // ✗ throws if empty

// Discriminated unions for state
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

### Error Handling

```typescript
// Backend: always throw typed HTTP exceptions
throw new NotFoundException(`Product not found: ${slug}`);
throw new ConflictException(`Slug already exists: ${slug}`);
throw new ForbiddenException('Insufficient permissions');

// Frontend (server): return null or empty array on fetch failure, never throw
const products = await apiFetch<Product[]>('/api/v1/products') ?? [];

// Frontend (client): use try/catch with user-visible error state
try {
  await submitRfq(data);
  setSubmitted(true);
} catch {
  setSubmitError('Network error. Please try again.');
}
// Never: catch (e) { console.log(e) } — swallowing errors
```

### Component Structure (Frontend)

Every component follows this order:

```tsx
// 1. 'use client' directive (if needed)
"use client";

// 2. External imports (alphabetical within group)
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// 3. Internal imports
import { apiFetch } from "@/lib/api";
import { EXPORT_COUNTRIES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import RFQForm from "@/components/ui/RFQForm";

// 4. Types/interfaces (local to this file)
interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// 5. Module-level constants (data arrays, static config)
const ANIMATION_VARIANTS = { ... };

// 6. Private sub-components (if < 30 lines and only used here)
function SpecRow({ label, value }: { label: string; value: string }) { ... }

// 7. Main component (default export)
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // 7a. Hooks (in declaration order)
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [isOpen, setIsOpen] = useState(false);

  // 7b. Derived values (no hooks, pure computation)
  const imageUrl = product.images[0]?.url ?? null;
  const shuLabel = product.shuMin && product.shuMax
    ? `${product.shuMin.toLocaleString()}–${product.shuMax.toLocaleString()} SHU`
    : null;

  // 7c. Event handlers
  function handleToggle() { setIsOpen((prev) => !prev); }

  // 7d. JSX
  return ( ... );
}
```

---

## 9. API Contracts

### Response Envelope (All endpoints)

```typescript
// Success
{ success: true; data: T }

// Paginated
{ success: true; data: { items: T[]; meta: PaginationMeta } }

// Error
{ success: false; error: { code: string; message: string }; meta: { path: string; timestamp: string } }
```

### Public Endpoints (No Auth)

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | `{ email, password }` | Sets cookies, returns `{ user: { id, email, role } }` |
| `POST` | `/api/v1/auth/refresh` | — (reads `refresh_token` cookie) | Rotates cookies, returns user |
| `POST` | `/api/v1/auth/logout` | — | Clears cookies |
| `GET` | `/api/v1/auth/me` | — | Current user |
| `GET` | `/api/v1/products` | — | `Product[]` (ACTIVE only) |
| `GET` | `/api/v1/products/slug/:slug` | — | `Product` (ACTIVE only — **BUG: fix**) |
| `GET` | `/api/v1/certifications` | — | `Certification[]` (active + not expired — **BUG: fix**) |
| `POST` | `/api/v1/rfq` | `CreateRfqDto` | `{ id, status: 'NEW' }` |

### Admin / Manager Endpoints (JWT required)

| Method | Path | Roles | Notes |
|---|---|---|---|
| `GET` | `/api/v1/rfq` | ADMIN, MANAGER | `?page=1&limit=20&status=NEW&country=UAE` |
| `GET` | `/api/v1/rfq/:id` | ADMIN, MANAGER | — |
| `PATCH` | `/api/v1/rfq/:id/status` | ADMIN, MANAGER | `{ status, internalNote?, assignedTo? }` |
| `GET` | `/api/v1/products/admin/all` | ADMIN, MANAGER | All statuses |
| `GET` | `/api/v1/products/:id` | ADMIN, MANAGER | By DB ID |
| `POST` | `/api/v1/products` | ADMIN, MANAGER | `CreateProductDto` |
| `PATCH` | `/api/v1/products/:id` | ADMIN, MANAGER | `UpdateProductDto` (partial) |
| `DELETE` | `/api/v1/products/:id` | ADMIN | Hard delete |
| `GET` | `/api/v1/certifications/admin/all` | ADMIN, MANAGER | All certs |
| `POST` | `/api/v1/certifications` | ADMIN | `CreateCertificationDto` |
| `PATCH` | `/api/v1/certifications/:id` | ADMIN | Partial |
| `DELETE` | `/api/v1/certifications/:id` | ADMIN | Hard delete |
| `POST` | `/api/v1/media/upload` | ADMIN | `multipart/form-data` |
| `DELETE` | `/api/v1/media/:id` | ADMIN | Deletes from S3 + DB |
| `GET` | `/api/v1/users` | ADMIN | All users |
| `POST` | `/api/v1/users` | ADMIN | `CreateUserDto` |
| `PATCH` | `/api/v1/users/:id` | ADMIN | `UpdateUserDto` |
| `DELETE` | `/api/v1/users/:id` | ADMIN | Soft delete (sets `isActive: false`) |

### Prisma Schema (Current)

```prisma
model Product {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  variety     String?
  shuMin      Int?
  shuMax      Int?
  astaValue   String?       // e.g. "35–40 ASTA"
  moisture    String?       // e.g. "≤ 12%"
  description String?
  status      ProductStatus @default(ACTIVE)
  images      MediaFile[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model RFQ {
  id           String    @id @default(cuid())
  name         String
  email        String
  country      String
  product      String    // free text (see tech debt §11)
  quantity     String    // free text (see tech debt §11)
  message      String?
  status       RFQStatus @default(NEW)
  internalNote String?
  assignedTo   String?   // free text user name (see tech debt §11)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Certification {
  id          String    @id @default(cuid())
  name        String
  issuingBody String
  certNumber  String?
  issuedAt    DateTime
  expiresAt   DateTime?
  fileUrl     String
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model MediaFile {
  id         String   @id @default(cuid())
  key        String   @unique  // S3 object key
  url        String            // public URL
  mimeType   String
  sizeBytes  Int
  uploadedBy String            // free text user ID (see tech debt §11)
  createdAt  DateTime @default(now())
  product    Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  productId  String?
}
```

---

## 10. Known Bugs (Fix Before Launch)

These are confirmed bugs found during the code audit. Fix in the order listed.

### Bug 1 — Public product slug endpoint exposes inactive products

**File:** `src/products/products.service.ts` → `findBySlug()`
**Impact:** INACTIVE and SEASONAL products accessible via `/products/[slug]` if slug is known.

```typescript
// Current (broken):
async findBySlug(slug: string) {
  const product = await this.prisma.product.findUnique({ where: { slug }, include: { images: true } });
  if (!product) throw new NotFoundException(`Product not found: ${slug}`);
  return product;
}

// Fixed:
async findBySlug(slug: string) {
  const product = await this.prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE },
    include: { images: true },
  });
  if (!product) throw new NotFoundException(`Product not found: ${slug}`);
  return product;
}
```

---

### Bug 2 — Public certifications endpoint returns expired certificates

**File:** `src/certifications/certifications.service.ts` → `findAllPublic()`
**Impact:** Buyers see outdated, expired certificates as valid.

```typescript
// Current (broken):
async findAllPublic() {
  return this.prisma.certification.findMany({ where: { active: true } });
}

// Fixed:
async findAllPublic() {
  return this.prisma.certification.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
    orderBy: { issuedAt: 'desc' },
  });
}
```

---

### Bug 3 — RFQ.tsx had stale references after RFQForm extraction

**Status:** Fixed — RFQ.tsx now delegates to `<RFQForm />`.

---

### Bug 4 — Two broken Pexels image URLs in homepage sections

**Status:** Fixed — Gallery.tsx (1537169) and Process.tsx (3827839) replaced with valid IDs.

---

### Bug 5 — Media delete has no authorization check

**File:** `src/media/media.service.ts` → `delete()`
**Impact:** Any authenticated user (including VIEWER) can delete any uploaded file.

```typescript
// Fixed: add role check in controller or pass uploader check
// In media.controller.ts:
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)  // only ADMIN can delete media
remove(@Param('id') id: string) {
  return this.mediaService.delete(id);
}
```

---

### Bug 6 — Media key generation uses Math.random() (collision risk)

**File:** `src/media/media.service.ts`
**Impact:** Two concurrent uploads could generate the same S3 key, silently overwriting a file.

```typescript
// Current (broken):
const key = `uploads/${Date.now()}-${Math.random()}.${ext}`;

// Fixed:
import { randomUUID } from 'crypto';
const key = `uploads/${randomUUID()}.${ext}`;
```

---

### Bug 7 — Login DTO allows 8-char passwords, but user creation requires 12

**File:** `src/auth/dto/login.dto.ts`
**Impact:** Validation inconsistency — confusing for any future password policy work.

```typescript
// Fixed in login.dto.ts:
@MinLength(8)  // login can stay 8 — it's a validation hint, not enforcement
// This is fine because the stored hash won't match a 8-char attempt for a 12-char password
// Document this intentionally: login DTO is lenient by design to avoid info leakage
```

---

## 11. Technical Debt (Prioritized)

Ranked by risk to the product. Address in sequence when capacity allows.

### P1 — Must fix before consistent team growth

| # | Item | File(s) | Fix |
|---|---|---|---|
| 1 | `EXPORT_COUNTRIES` + `RFQ_PRODUCT_OPTIONS` duplicated in 3 files | `RFQ.tsx`, `RFQForm.tsx`, `contact/page.tsx` | Move to `lib/constants.ts` |
| 2 | `category` derivation duplicated in `products/page.tsx` and `products/[slug]/page.tsx` | same | Move to `lib/utils.ts → deriveProductCategory()` |
| 3 | `formatDate()` duplicated across pages | `quality/page.tsx`, future admin | Move to `lib/utils.ts → formatDisplayDate()` |
| 4 | `app/not-found.tsx` missing | — | Create branded 404 page |
| 5 | `app/error.tsx` missing | — | Create error boundary page |
| 6 | Hardcoded `#8B1E14` in RFQ.tsx and contact/page.tsx | both | Add `--color-red-chilli-deep: #8B1E14` to `globals.css @theme` and use token |
| 7 | Copyright year `2024` hardcoded in Footer | `Footer.tsx` | `new Date().getFullYear()` |
| 8 | Social link `href="#"` in Footer | `Footer.tsx` | Populate from constants or hide until real URLs available |

### P2 — Fix before admin portal

| # | Item | File(s) | Fix |
|---|---|---|---|
| 9 | `lib/api.ts` missing — fetch scattered in pages | multiple | Create as described in §6 |
| 10 | `MediaFile.uploadedBy` is a free string, not FK to User | schema | Add `uploadedBy User @relation(...)` — requires migration |
| 11 | `RFQ.assignedTo` is a free string, not FK to User | schema | Same — add relation, requires migration |
| 12 | No `loading.tsx` for async routes | products/, quality/ | Add skeleton loading state |
| 13 | `CountUp` uses `setInterval` without `prefers-reduced-motion` check | `Metrics.tsx` | Add `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check |
| 14 | GSAP plugin registered on every render in Process.tsx | `Process.tsx` | Register once at module level inside `if (typeof window !== 'undefined')` |

### P3 — Fix before production launch

| # | Item | Notes |
|---|---|---|
| 15 | No sitemap.ts / robots.ts | Phase 6 |
| 16 | No JSON-LD structured data | Phase 6 |
| 17 | No OG image per product | Phase 6 |
| 18 | Notification emails have no retry — fire-and-forget `.catch(() => null)` | Add a simple retry wrapper or a Bull queue task |
| 19 | RFQ status transitions are unrestricted | Add allowed-transitions map in RfqService |
| 20 | `isRenewalPending()` in `quality/page.tsx` should use `isExpiringWithin()` from `lib/utils.ts` | Dedup after utils.ts is created |
| 21 | Mobile menu doesn't trap focus (accessibility) | Add focus-trap logic or use `focus-trap-react` |
| 22 | Form inputs missing `aria-describedby` linking to error messages | Update `InputField` component in `RFQForm.tsx` |

### P4 — Long-term hardening (post-launch)

| # | Item | Notes |
|---|---|---|
| 23 | No audit log for admin actions (status updates, product edits) | Add `AuditLog` Prisma model |
| 24 | Refresh token with no rotation or blacklist | Consider storing refresh token hash in DB |
| 25 | No email verification flow for buyers | New `EmailVerification` module |
| 26 | GDPR: no data export or right-to-erasure endpoint | Required for EU market |
| 27 | RFQ DTO: `product` should be product ID, `quantity` should be number | Breaking change — coordinate with frontend |
| 28 | No request logger middleware in backend | Add correlation IDs for debugging |

---

## 12. Remaining Roadmap

### Phase 6 — SEO & Metadata

All items are parallel — no blocking dependencies.

- [ ] **`app/layout.tsx`** — upgrade metadata object to match ROADMAP spec (metadataBase, title template, full openGraph, twitter card)
- [ ] **`app/sitemap.ts`** — static routes + all product slugs from API
- [ ] **`app/robots.ts`** — allow all, disallow `/admin`
- [ ] **Product pages** — `generateMetadata()` already in place; ensure OG description pulls from `product.description`
- [ ] **Homepage** — add `Organization` JSON-LD schema
- [ ] **Product detail** — add `Product` JSON-LD schema
- [ ] **LCP fix** — `Hero.tsx` needs `<video>` element added with real asset or poster fallback

### Phase 7 — Admin Portal

Build in this exact order (each item depends on the previous):

1. **`app/admin/layout.tsx`** — sidebar + topbar shell, auth check via `GET /auth/me`, redirect to `/admin/login` on 401
2. **`app/admin/login/page.tsx`** — login form → `POST /auth/login`
3. **`app/admin/dashboard/page.tsx`** — RFQ count by status, recent submissions
4. **`app/admin/rfq/page.tsx`** — paginated table, filter by status
5. **`app/admin/rfq/[id]/page.tsx`** — full RFQ detail, status update, internal notes
6. **`app/admin/products/page.tsx`** — product table with status badges
7. **`app/admin/products/new/page.tsx`** — create product form + image upload
8. **`app/admin/products/[id]/page.tsx`** — edit product
9. **`app/admin/certifications/page.tsx`** — cert list
10. **`app/admin/certifications/new/page.tsx`** — upload cert + PDF
11. **`app/admin/media/page.tsx`** — S3 media library
12. **`app/admin/users/page.tsx`** — user management (ADMIN role only)

**Admin design rules:**
- Same design tokens as public site. No external UI library.
- Dark theme: `bg-black-deep` body, `bg-black-rich` sidebar, gold accents.
- RFQ status badge colors: `NEW` → gold · `IN_REVIEW` → blue · `QUOTED` → green · `CLOSED` → gray.
- Tables: sortable columns, row hover `bg-black-rich`, status badges semantic.
- Forms: same `InputField` + RHF + Zod pattern as public site.
- `"use client"` for interactive tables/forms. Layout auth check can be a server component that redirects.

### Phase 8 — Advanced (Deferred Until Post-Launch)

- Page transitions via `AnimatePresence` + `usePathname` — simple fade, no slide
- Three.js particle background (≤ 2000 particles, gold at 15% opacity, mouse parallax)
- Spline 3D hero object (pending asset creation)
- Arabic i18n via `next-intl` (UAE, Saudi, Qatar primary targets)

---

## 13. Environment Variables

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production: `NEXT_PUBLIC_API_URL=https://api.deccanharvests.com`

### Backend (`.env`)

```bash
# Server
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/deccan_harvests

# JWT (min 32 chars each)
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@deccanharvests.com
ADMIN_EMAIL=exports@deccanharvests.com
```

---

## 14. Deployment

| Environment | Frontend | Backend |
|---|---|---|
| Local dev | `npm run dev` → `:3000` | `npm run start:dev` → `:4000` |
| Production | Vercel (recommended) — no `output: 'export'`, ISR requires serverless | Docker — `npm run start:prod` |

**Vercel config:**
- Set `NEXT_PUBLIC_API_URL` in project environment variables.
- `next.config.ts` already has Pexels + Unsplash `remotePatterns`. Add S3 bucket domain before switching to real product images.
- Do not set `output: 'export'` — ISR/SSR won't work.

**Image migration (pre-launch):**
- All current product images use Pexels CDN URLs (from seed data).
- Before launch: upload real product photos via admin portal → they become S3 URLs → update products via `PATCH /api/v1/products/:id`.
- Add S3 bucket domain to `next.config.ts` `remotePatterns` at that point.
