# Deccan Harvests — Master Implementation Plan

**Last updated:** 2026-05-23
**Status:** Active. Every engineering and design decision in this codebase traces back to this document.
**Rule:** If it is not in this plan, discuss before coding. If it is in this plan, follow it without deviation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Layout](#2-repository-layout)
3. [Tech Stack](#3-tech-stack)
4. [Current State](#4-current-state)
5. [Design Philosophy — Premium Brand Standard](#5-design-philosophy--premium-brand-standard)
6. [Design System (Locked Tokens)](#6-design-system-locked-tokens)
7. [Design Issues & Remediation Plan](#7-design-issues--remediation-plan)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [Coding Standards](#10-coding-standards)
11. [API Contracts](#11-api-contracts)
12. [Known Bugs (Fix Before Launch)](#12-known-bugs-fix-before-launch)
13. [Technical Debt (Prioritized)](#13-technical-debt-prioritized)
14. [Remaining Roadmap](#14-remaining-roadmap)
15. [Environment Variables](#15-environment-variables)
16. [Deployment](#16-deployment)

---

## 1. Project Overview

**Brand:** Deccan Harvests
**Legal entity:** Mulukutla Exports Pvt. Ltd.
**Business:** B2B premium spice exporter — Guntur chilli, turmeric, coffee, spice powders — to 20+ countries.
**Audience:** International importers, wholesalers, distributors placing bulk commodity orders.

**Brand Positioning:**
This is not a commodity supplier website. The brand sits at the intersection of *Indian agricultural heritage* and *world-class export standards* — the same positioning as Belazu (premium Mediterranean ingredients), Heilala Vanilla (provenance-first), and Patagonia Provisions (narrative + quality). Every design and copy decision should reinforce: **we are the premium, trusted source, not the cheapest option**.

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
│   │   ├── admin/               ← Admin portal (Phase 7)
│   │   ├── products/
│   │   │   └── [slug]/
│   │   ├── about/
│   │   ├── quality/
│   │   ├── contact/
│   │   ├── exports/
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← Homepage
│   │   ├── not-found.tsx        ← TODO: create (Phase D1)
│   │   ├── error.tsx            ← TODO: create (Phase D1)
│   │   ├── sitemap.ts           ← TODO: create (Phase 6)
│   │   └── robots.ts            ← TODO: create (Phase 6)
│   ├── components/
│   │   ├── layout/              ← Navbar, Footer
│   │   ├── sections/            ← Homepage-only full-width sections
│   │   ├── ui/                  ← Shared, reusable UI primitives
│   │   └── providers/           ← Context/provider wrappers
│   ├── lib/
│   │   ├── api.ts               ✅ Done
│   │   ├── constants.ts         ✅ Done
│   │   ├── types.ts             ✅ Done
│   │   └── utils.ts             ✅ Done
│   └── docs/
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
| Animation | Framer Motion | 12.x | Use for UI transitions and scroll-reveal |
| Animation | GSAP + ScrollTrigger | 3.x | Use for scroll-driven timeline animations only |
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
| `/` | ✅ Complete | Static + `POST /rfq` | All 10 sections live. Design issues documented in §7 |
| `/products` | ✅ Built | `GET /products` | Filter by category via URL param. lib/ refactored |
| `/products/[slug]` | ✅ Built | `GET /products/slug/:slug` | Spec table, related, mobile sticky CTA |
| `/about` | ✅ Built | Static | Founding story, values, metrics |
| `/quality` | ✅ Built | `GET /certifications` | Renewal-pending badge, testing standards |
| `/contact` | ✅ Built | Static + `POST /rfq` | Map embed, FAQ accordion. Needs redesign (§7) |
| `/exports` | ✅ Built | Static | Markets, Incoterms, capabilities |
| `/admin/*` | ❌ Not started | All admin APIs | Phase 7 |

### Frontend Infrastructure

| Item | Status | Notes |
|---|---|---|
| Design tokens (`globals.css`) | ✅ Complete | Colors, fonts, easings locked |
| Film grain overlay | ✅ Complete | Fixed, `z-9999`, `pointer-events: none` |
| Lenis + GSAP ticker | ✅ Complete | `SmoothScrollProvider` |
| `lib/api.ts` | ✅ Done | `apiFetch<T>()` with ISR + envelope unwrap |
| `lib/constants.ts` | ✅ Done | RFQ_COUNTRIES, RFQ_PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_FORMATS |
| `lib/types.ts` | ✅ Done | Product, Certification, ProductImage interfaces |
| `lib/utils.ts` | ✅ Done | deriveProductCategory, formatDisplayDate, isExpiringWithin |
| `RFQForm` shared component | ✅ Complete | Used by `/` and `/contact` |
| `app/not-found.tsx` | ❌ Missing | Shows default Next.js 404 |
| `app/error.tsx` | ❌ Missing | Unhandled errors show nothing |
| Metadata / sitemap | ❌ Missing | Phase 6 |

### Backend Modules

| Module | Status | Notes |
|---|---|---|
| Auth (login/refresh/logout/me) | ✅ Complete | JWT httpOnly cookies, 15m access / 7d refresh |
| Products (CRUD + public) | ✅ Complete | **Bug §12.1:** slug endpoint exposes INACTIVE products |
| RFQ (create + admin CRUD) | ✅ Complete | Fire-and-forget email, no retry |
| Certifications (CRUD + public) | ✅ Complete | **Bug §12.2:** expired certs not filtered on public |
| Media (S3 upload/delete) | ✅ Complete | **Bug §12.5:** any authed user can delete any file |
| Users (CRUD, soft delete) | ✅ Complete | ADMIN-only |
| Notifications (Resend email) | ✅ Complete | No retry on failure |
| Seed data | ✅ Complete | 8 products + 5 certs via `prisma/seed.ts` |

---

## 5. Design Philosophy — Premium Brand Standard

This section defines the aesthetic DNA of the brand. It is the single reference for every visual decision. When in doubt, compare the decision against the principle here, not against what "looks good" or is "common on websites."

### The Reference Tier

The visual standard is set by these brands. Study them before designing anything new:

- **Belazu** (belazu.com) — premium Mediterranean ingredients. Editorial, ingredient-first photography, generous whitespace, restrained typography.
- **Heilala Vanilla** — provenance storytelling, farm-to-world narrative, luxury through authenticity.
- **Patagonia Provisions** — mission-driven narrative woven into every page, not just the About page. Products shown as stories, not SKUs.
- **Mariage Frères** — French luxury tea house. Dark/ivory contrast, serif-dominant, magazine-quality layouts.
- **Yalumba Winery** — heritage narrative with export credentials, world map, tasteful dark palette.

### Core Principles

**1. Whitespace is the brand's most expensive asset.**
Every element needs breathing room. A crowded section communicates anxiety. Generous margins communicate confidence. Minimum `py-24` on all sections (192px top + bottom). Inner page heroes: `pt-40`.

**2. Typography sets the tone before any image loads.**
- Hero/editorial moments: Cormorant at `clamp(4rem, 10vw, 9rem)` — cinematic scale.
- Section headings: Playfair at `clamp(2rem, 4vw, 3.2rem)` — authoritative.
- Body/captions: Inter at `0.85–0.95rem` — precision, not decoration.
- Labels/tags/nav: Space Grotesk at `0.65–0.78rem` with `tracking-[0.15em]` — technical, grounded.
Never mix roles. Mixing fonts erodes the typographic hierarchy that creates the premium feel.

**3. Every image is a hero.**
No placeholder aesthetics. Images must be full-bleed, high-contrast, correctly cropped. Overlays serve narrative (dark gradient over video) — they do not wash out images (no ivory/white fog at 60% opacity on photos). If no real image is available, use a controlled dark overlay on a strong Pexels photo.

**4. Motion is a whisper, not a shout.**
Slow reveals. No bounce. No spring physics. Cinema easing only: `cubic-bezier(0.16, 1, 0.3, 1)`. Stagger 0.1s between items max. Animations should feel like pages turning, not elements exploding onto screen. The moment anything feels "web agencyish" or "templatey," pull it back.

**5. Grid structure over symmetry.**
Premium editorial layouts break the symmetric 2-col / 3-col grid deliberately. Use:
- `grid-cols-[60%_40%]` asymmetric layouts for product detail, process, contact.
- Full-bleed sections that break the container (hero, testimonials, cinematic images).
- Deliberate overlap between elements (e.g., an image bleeding across a section boundary).
Avoid uniform card grids for anything that tells a story. Cards are for admin UIs.

**6. Trust signals appear early, not after scrolling.**
B2B buyers decide trust in 8 seconds. Certifications (ISO, HACCP, APEDA), metric numbers (20+ countries, 1000+ MT), and the product origin story must be visible on the first 2 screens. These are not footer items.

**7. Bespoke, not template.**
Every section should feel like it was designed specifically for this brand and its buyer. The moment a section feels like it came from a Framer/Webflow template, redesign it. Reference: the connecting SVG line in the Process section should connect the actual icon circles, not be an arbitrary horizontal rule.

**8. Color restraint.**
Gold (`#C9A84C`) is an accent, not a fill. It appears on labels, underlines, icon strokes, and one key CTA per section. It never fills large areas except the primary submit button. The background is always `black-deep` or `black-rich` (dark pages) or `ivory` (contrast sections). No grays, no off-whites, no blue-tints.

---

## 6. Design System (Locked Tokens)

These tokens are defined in `app/globals.css @theme`. Never bypass them with hardcoded values.

### Colors

```css
--color-gold:             #C9A84C   /* Primary accent — labels, borders, CTAs */
--color-gold-light:       #E8C97A   /* Gold hover state */
--color-gold-dark:        #A07830   /* Gold active/pressed state */
--color-black-deep:       #0A0A0A   /* Primary dark background */
--color-black-rich:       #111111   /* Elevated dark surface (cards, sidebars) */
--color-ivory:            #F5F0E8   /* Warm light surface — contrast sections */
--color-ivory-dark:       #EDE8DC   /* Ivory border, dividers */
--color-red-chilli:       #A0291E   /* Chilli brand accent */
--color-red-chilli-deep:  #8B1E14   /* RFQ section, contact hero */
--color-smoke:            #FAFAF8   /* Primary text on dark */
--color-muted:            #6B6560   /* Secondary text on ivory */
```

**Rule:** `style={{ color: '#...' }}` or `style={{ backgroundColor: '#...' }}` are prohibited. Always use the Tailwind token (`text-gold`, `bg-red-chilli-deep`, etc.). The only exception is GSAP/SVG inline style where CSS variables must be set programmatically.

### Typography

```
font-display  → var(--font-cormorant)      Hero headings, editorial pull-quotes, large metric numbers
font-serif    → var(--font-playfair)       Section H2/H3, product names, page headings
font-sans     → var(--font-inter)          Body, descriptions, forms, small print
font-grotesk  → var(--font-space-grotesk)  Labels, nav, buttons, tags, captions, eyebrows
```

**Never mix roles.** A product name is a heading → Playfair. A spec label is a tag → Space Grotesk.

### Easing

```
--ease-cinema:  cubic-bezier(0.16, 1, 0.3, 1)   /* Default for all entrances */
--ease-smooth:  cubic-bezier(0.4, 0, 0.2, 1)    /* UI state changes */
```

### Section Padding (Standard)

```
Outer container:  max-w-[1440px] mx-auto px-6 lg:px-12
Section padding:  py-24 lg:py-32 (standard) | py-16 (compact CTA strips)
Inner page hero:  pt-40 pb-16 (clears fixed navbar at 80px height + 80px breathing room)
```

**This is the one source of truth for padding.** The Hero section uses `px-6 lg:px-12` — the same as every other section. Any section using `lg:px-24` or other values is incorrect and must be fixed.

### Animation Rules (Locked)

- **No bounce easing.** Only `easeOut`, `easeInOut`, `--ease-cinema`, `--ease-smooth`.
- **Min duration:** 300ms. **Max duration:** 1200ms.
- **Scroll animations:** `once: true` + `margin: "-60px"` on `useInView`.
- **Never animate `width` or `height`.** Use `scaleX`/`scaleY` or `clipPath`.
- **GSAP** — only for scroll-driven (ScrollTrigger) timelines. Not for hover/click interactions.
- **Framer Motion** — for all mount/unmount transitions and UI state animations.
- **Stagger maximum:** 0.12s between sibling elements. Over-stagger looks like a template.
- `prefers-reduced-motion` — CSS handles it globally; GSAP animations must also check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

---

## 7. Design Issues & Remediation Plan

Issues identified from live screenshots on 2026-05-23. Each issue has a severity level, root cause, and the exact fix required.

**Severity:** `P0` = blocking launch | `P1` = fix in current sprint | `P2` = fix before marketing push

---

### Issue D1 — Content bleeds to edge (padding inconsistency)

**Severity:** P0
**Symptom:** Hero text ("TO GLOBAL MARKETS") and inner page headings appear flush against the viewport edge with no visible left margin.
**Root cause:** `Hero.tsx` content div uses `px-6 lg:px-24` (96px at `lg`), but the Navbar uses `px-6 lg:px-12` (48px). At `lg` breakpoints, the Navbar items and hero content don't align. Inner page headings use `px-6 lg:px-12` correctly.
**Fix:**
```tsx
// Hero.tsx — change:
<div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-24 flex flex-col">
// To:
<div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col">
```
After this change, all sections, navbar, and hero text share the same left edge.

---

### Issue D2 — White fog / ivory wash over Origin section photo

**Severity:** P1
**Symptom:** The chilli photo in the Origin section (left column) has a heavy white/ivory gradient across it, washing out the image and making it look like a screenshot glitch.
**Root cause:** `Origin.tsx:97` — `bg-gradient-to-t from-ivory/60 to-transparent`. The 60% ivory overlay at the bottom of the image bleeds aggressively into the ivory section background.
**Fix:** Remove the overlay entirely. The ivory section background is the blending context — the image does not need a fade-out; it should be a clean, confident crop.
```tsx
// Origin.tsx — remove this line entirely:
<div className="absolute inset-0 bg-gradient-to-t from-ivory/60 to-transparent" />
```
If a soft edge is needed later, use `from-ivory/10` maximum.

---

### Issue D3 — Logo stacking misaligned

**Severity:** P1
**Symptom:** "DECCAN" (large) and "harvests" (tiny) stacked vertically. The tracking difference (`0.22em` vs `0.38em`) creates visual misalignment — "harvests" appears not to start at the same left edge as "DECCAN". On mobile the stacked form is too compact.
**Root cause:** `Navbar.tsx:49-62` — different `tracking` values on two lines, no matching baseline.
**Fix:** Unify to single-line logo: `DECCAN` in smoke + `HARVESTS` in gold, same size, same tracking. Cleaner, more legible at all viewports.
```tsx
<Link href="/" className="flex items-baseline gap-2 group">
  <span
    className="text-[1.1rem] font-semibold tracking-[0.25em] text-smoke uppercase"
    style={{ fontFamily: "var(--font-space-grotesk)" }}
  >
    Deccan
  </span>
  <span
    className="text-[1.1rem] font-semibold tracking-[0.25em] text-gold uppercase"
    style={{ fontFamily: "var(--font-space-grotesk)" }}
  >
    Harvests
  </span>
</Link>
```

---

### Issue D4 — Process section connecting line misaligned

**Severity:** P1
**Symptom:** The gold horizontal SVG line in the "From Farm to World With Care" section does not visually connect the step icon circles. It draws a full-width horizontal rule that doesn't thread through the icon centers.
**Root cause:** `Process.tsx:110-123` — the SVG `line` starts at `x1="0"` but the first icon circle is centered roughly 1/6 of the grid width from the left (inside its grid cell). The line starts 20px from the left edge, not from the center of the first icon. Also, `stroke-dasharray: 1000` but actual SVG `width="100%"` — the GSAP animation works but the line position is wrong.
**Fix approach:** Remove the horizontal SVG connector entirely. Replace with step numbers displayed as large, light Cormorant numerals above each step. This is cleaner, more editorial, and sidesteps the grid-alignment problem entirely. The visual connection is created by the consistent vertical rhythm, not a line.

Alternatively: use a CSS `::before` pseudo-element on the grid container for the connector, positioned precisely at `top: 20px` (center of `h-10` icon = 20px), using `border-top: 1px solid rgba(201,168,76,0.3)`. This stays inside the CSS layer and responds to layout changes automatically.

---

### Issue D5 — Certification cards feel boxy and generic

**Severity:** P1
**Symptom:** The ISO 22000, HACCP, APEDA, Spices Board fallback cards on `/quality` are standard `border p-6 bg-smoke` cards — indistinguishable from every SaaS pricing page.
**Root cause:** `quality/page.tsx` — static fallback uses the card pattern.
**Fix:** Replace card grid with a horizontal register list. Each cert is a full-width row:

```
[Icon]   ISO 22000:2018          SGS India Pvt. Ltd.              Food Safety Management
         ─────────────────────────────────────────────────────────────────────────────
[Icon]   HACCP                   Bureau Veritas India              Hazard Analysis...
```

This pattern is used by every premium food importer on their compliance pages. It reads like an official register, not a website template. Use `divide-y divide-ivory-dark` for the separators.

---

### Issue D6 — RFQ form wrapped in a floating box

**Severity:** P1
**Symptom:** `RFQForm.tsx` wraps all form content in `bg-black-rich/40 backdrop-blur-sm p-8 lg:p-10` — a semi-opaque lifted box. This looks like a modal dialog sitting inside the page, not a native part of the design.
**Root cause:** The box wrapper was added to provide visual separation on the homepage RFQ section. But it creates a "foreign object" feel everywhere it appears.
**Fix:** Remove `bg-black-rich/40 backdrop-blur-sm` from the motion wrapper. Let the form's fields (with `border-b border-white/20`) stand against the section's own background. Add a `pb-2 mb-6 border-b border-white/10` header row inside the form: "Request a Quote" title + subtitle — this gives the form an identity without a box border.

---

### Issue D7 — Contact page lacks narrative — feels like a utility form

**Severity:** P1
**Symptom:** The contact page presents a heading, a form, and an FAQ. It communicates nothing about the company beyond "here is a form." Premium B2B buyers evaluate vendors through the *feel* of interactions, not just the data.
**Root cause:** Structural — the contact page was built as a form utility, not as the culmination of the brand story.
**Fix:** Redesign the contact page layout and copy with a narrative arc:

```
SECTION 1 — Hero (dark, full-bleed)
  "Every Great Partnership Starts with a Conversation"
  Subtext: "We've shipped to 20+ countries. Tell us where you want to go."
  3 micro-steps inline: [Share your specs] → [Pricing in 24h] → [Ship worldwide]

SECTION 2 — Form + Trust Column (2-col)
  Left col (40%):
    - "Who we work with" — importers / wholesalers / distributors (3 lines, not a list)
    - Key trust signals: ISO 22000 · HACCP · APEDA · 15+ years
    - Contact details (minimal, inline)
    - No map embed (save space for story)
  Right col (60%):
    - RFQ form, borderless, label-above-field style
    - Headline above form: "Tell us what you need"

SECTION 3 — FAQ (dark, narrow max-width centered, existing content is good)
```

The Google Maps embed should be moved to the About page or footer — it doesn't aid the conversion goal of the contact page.

---

### Issue D8 — Hero section has no video asset (falls back to pure black)

**Severity:** P0 (content gap, not code issue)
**Symptom:** The hero shows completely black — no background image or video. The `<video>` element has no fallback `<img>` and the `poster` attribute points to `/images/hero-poster.jpg` which doesn't exist.
**Root cause:** No real media asset has been provided yet.
**Fix (interim):** Use a Pexels full-bleed image as `poster` and add a background `<Image>` fallback while the real video is being produced. Replace `poster="/images/hero-poster.jpg"` with a working URL and add an `<Image>` behind the video element as a CSS fallback.
**Fix (final):** Provide and host a 1080p drone footage MP4 of Guntur chilli fields. The video must be compressed to ≤ 8MB for acceptable LCP.

---

### Issue D9 — Product cards have uniform height / no visual rhythm

**Severity:** P2
**Symptom:** The product listing page (`/products`) shows a symmetric 3-column grid of identical cards. This looks like an e-commerce template, not an editorial brand page.
**Fix:** Introduce a masonry-offset or "editorial featured" layout:
- First product in the filtered view gets a full-width featured card (horizontal layout, large image on left, specs on right).
- Remaining products render in the standard 3-col grid.
- Or: alternate card aspect ratios (some `aspect-[16/10]`, some `aspect-[4/3]`) for visual rhythm.

---

### Issue D10 — No `not-found.tsx` or `error.tsx` boundary pages

**Severity:** P0 (user experience / first impression)
**Symptom:** Non-existent routes show the default Next.js 404 page, breaking the brand experience entirely.
**Fix:** Create both pages with the brand's dark design, the logo, a brief message, and a link home. They should feel like a premium 404, not a server error.

```
app/not-found.tsx  — "This page doesn't exist. Let's find your way back."
app/error.tsx      — "Something went wrong. We've been notified."
```

---

## 8. Frontend Architecture

### The Golden Rule

> **Server Components by default. Add `"use client"` only when the component needs browser APIs, event handlers, or state.**

```
app/products/page.tsx              → Server Component (fetches data)
app/contact/page.tsx               → Client Component (has useState for FAQ)
app/quality/page.tsx               → Server Component (no interactivity)
components/sections/Hero.tsx       → Client Component (video, scroll listener, GSAP)
components/ui/RFQForm.tsx          → Client Component (form state)
```

### Data Fetching Pattern

All server-side fetches go through `lib/api.ts`. **Do not call `fetch()` directly in page components.**

```typescript
// lib/api.ts — single source for all API communication
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { revalidate, ...fetchOptions } = options;
  const nextOptions = revalidate !== undefined ? { next: { revalidate } } : {};
  try {
    const res = await fetch(apiUrl(path), { ...fetchOptions, ...nextOptions });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}

// Usage:
const products = await apiFetch<Product[]>('/api/v1/products', { revalidate: 3600 }) ?? [];
```

**Rules:**
- ISR default: `revalidate: 3600` (1 hour). Override per-call where needed.
- Always return `null` on failure — never throw from `apiFetch`.
- Pages handle `null` gracefully with empty states or fallback content.
- Never use `useEffect` + `fetch` for data that could be server-fetched.

### Shared Lib Files

```
lib/types.ts      → Product, ProductImage, Certification interfaces
lib/constants.ts  → RFQ_COUNTRIES, RFQ_PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_FORMATS, CERT_RENEWAL_THRESHOLD_DAYS
lib/api.ts        → apiFetch<T>(), apiUrl()
lib/utils.ts      → deriveProductCategory(), getProductFormats(), formatDisplayDate(), isExpiringWithin()
```

**Rule:** All repeated data and logic lives in `lib/`. Never define inline in page components.

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
- `RFQForm.tsx` — form logic, used on homepage and `/contact`
- `SectionLabel.tsx` — TODO: extract the eyebrow label pattern
- `SpecTable.tsx` — TODO: extract from product detail (reused in admin)
- `StatusBadge.tsx` — TODO: for RFQ status chips in admin portal

**Sections (`components/sections/`)** — homepage-only. Do not import in inner pages.

**Page layouts** — do not create a shared `PageLayout` wrapper. Each page imports `Navbar` + `Footer` directly. This matches the homepage pattern and keeps pages independent.

### Missing Infrastructure (Create in Phase D1)

```
app/not-found.tsx    — 404 page (branded, with home link) — SEE ISSUE D10
app/error.tsx        — Runtime error boundary page — SEE ISSUE D10
```

---

## 9. Backend Architecture

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
@IsString() @MinLength(2) @MaxLength(255)
name: string;

// Optional fields — always @IsOptional() first
@IsOptional() @IsString() @MaxLength(2000)
description?: string;

// Enums — always @IsEnum()
@IsEnum(ProductStatus)
status: ProductStatus;

// Numbers — always @IsInt() or @IsNumber() + bounds
@IsInt() @Min(0) @Max(2_000_000)
shuMin: number;

// Dates — @IsDateString() for ISO strings in DTOs
@IsDateString()
issuedAt: string;

// URLs — @IsUrl()
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
- Foreign key relationships must use Prisma relation syntax.
- Every `findUnique` / `findFirst` that can return null must handle the `null` case explicitly.

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
  product      String    // free text — see tech debt §13
  quantity     String    // free text — see tech debt §13
  message      String?
  status       RFQStatus @default(NEW)
  internalNote String?
  assignedTo   String?   // free text user name — see tech debt §13
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
  url        String
  mimeType   String
  sizeBytes  Int
  uploadedBy String           // free text — see tech debt §13
  createdAt  DateTime @default(now())
  product    Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  productId  String?
}
```

---

## 10. Coding Standards

### The Hierarchy

1. **Correct first** — it must work, handle errors, handle edge cases.
2. **Readable second** — the next engineer must understand it in 30 seconds.
3. **Simple third** — the fewest moving parts that satisfy 1 and 2.
4. **Efficient last** — optimize only after measuring a bottleneck.

### Naming Conventions

```
# React components — PascalCase, single responsibility
components/ui/RFQForm.tsx           ✅
components/sections/ProductCard.tsx ✅

# Route pages — always page.tsx, layout.tsx (Next.js convention)
app/products/page.tsx               ✅

# Lib modules — camelCase, noun or noun-verb
lib/api.ts, lib/constants.ts        ✅

# Backend files — NestJS convention: kebab-case.type.ts
src/products/products.service.ts    ✅
```

```typescript
// Intent-based naming — name describes WHY, not HOW
const isRenewalPending = isExpiringWithin(cert.expiresAt)  // ✅
const checkCert = ...                                       // ✗

// Booleans — prefix with is/has/can/should
const isLoading = true   // ✅   loading = true  // ✗

// Functions — verb-noun
function deriveProductCategory()  // ✅
function getProductFormats()      // ✅
function buildArc()               // ✅
function checkProduct()           // ✗ (what kind of check?)

// Event handlers — handle prefix
function handleSubmit()  // ✅    function onSubmit()  // ✗ (on is for prop names)

// Constants — SCREAMING_SNAKE_CASE for primitives, arrays acceptable either way
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  // ✅
const RFQ_COUNTRIES = [...]                    // ✅
```

### General Rules

```typescript
// Guard clauses over nested conditions
function deriveCategory(slug: string): ProductCategory {
  if (slug.includes('chilli')) return 'Chillies';   // ✅ early return
  if (slug.includes('turmeric')) return 'Turmeric';
  if (slug.includes('coffee')) return 'Coffee';
  return 'Spice Powders';
}

// Named constants for all magic values
const RENEWAL_THRESHOLD_DAYS = 30;  // ✅
isExpiringWithin(cert.expiresAt, 30);  // ✗

// No multi-responsibility functions
// Bad:  fetchAndRenderProducts()
// Good: fetchProducts() + <ProductGrid products={products} />

// Extract helper when used 2+ times OR logic is non-obvious
```

### TypeScript Rules

```typescript
// Explicit return types on all exported functions
export async function apiFetch<T>(path: string): Promise<T | null> { ... }  // ✅

// Interface over type alias for object shapes
interface Product { ... }  // ✅

// Strict null handling — never assume a value exists
const image = product.images[0]?.url ?? null;  // ✅
const image = product.images[0].url;           // ✗
```

### CSS / Tailwind Rules

```
// Never hardcode hex values
className="text-gold"           // ✅
style={{ color: '#C9A84C' }}    // ✗

// Never use arbitrary Tailwind values for brand colors
className="text-[#C9A84C]"      // ✗

// Breakpoint order — mobile first, ascending
className="text-sm md:text-base lg:text-lg"  // ✅
```

### Component Structure Order

```tsx
"use client";                           // 1. directive if needed

import { useState, useRef } from "react";  // 2. external imports
import { motion } from "framer-motion";
import Image from "next/image";

import { apiFetch } from "@/lib/api";    // 3. internal imports
import { RFQ_COUNTRIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface ProductCardProps { ... }       // 4. local types

const ANIMATION_DELAY = 0.1;            // 5. module-level constants

function SpecRow() { ... }              // 6. private sub-components (< 30 lines)

export default function ProductCard()   // 7. main component
{
  const ref = useRef(null);             // 7a. hooks
  const [open, setOpen] = useState(false);

  const imageUrl = product.images[0]?.url ?? null;  // 7b. derived values

  function handleToggle() { ... }       // 7c. event handlers

  return ( ... );                       // 7d. JSX
}
```

### Error Handling

```typescript
// Backend: typed HTTP exceptions
throw new NotFoundException(`Product not found: ${slug}`);
throw new ForbiddenException('Insufficient permissions');

// Frontend server: return null/empty on fetch failure — never throw
const products = await apiFetch<Product[]>('/api/v1/products') ?? [];

// Frontend client: try/catch with user-visible error state
try {
  await submitRfq(data);
  setSubmitted(true);
} catch {
  setSubmitError('Network error. Please try again.');
}
// Never: catch (e) { console.log(e) } — swallowing errors is forbidden
```

---

## 11. API Contracts

### Response Envelope (All endpoints)

```typescript
{ success: true; data: T }
{ success: true; data: { items: T[]; meta: PaginationMeta } }
{ success: false; error: { code: string; message: string }; meta: { path: string; timestamp: string } }
```

### Public Endpoints (No Auth)

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | `{ email, password }` | Sets cookies, returns `{ user }` |
| `POST` | `/api/v1/auth/refresh` | — (reads `refresh_token` cookie) | Rotates cookies |
| `POST` | `/api/v1/auth/logout` | — | Clears cookies |
| `GET` | `/api/v1/auth/me` | — | Current user |
| `GET` | `/api/v1/products` | — | `Product[]` (ACTIVE only) |
| `GET` | `/api/v1/products/slug/:slug` | — | `Product` (ACTIVE only — **Bug §12.1**) |
| `GET` | `/api/v1/certifications` | — | `Certification[]` (active + not expired — **Bug §12.2**) |
| `POST` | `/api/v1/rfq` | `CreateRfqDto` | `{ id, status: 'NEW' }` |

### Admin / Manager Endpoints (JWT required)

| Method | Path | Roles | Notes |
|---|---|---|---|
| `GET` | `/api/v1/rfq` | ADMIN, MANAGER | `?page=1&limit=20&status=NEW&country=UAE` |
| `GET` | `/api/v1/rfq/:id` | ADMIN, MANAGER | — |
| `PATCH` | `/api/v1/rfq/:id/status` | ADMIN, MANAGER | `{ status, internalNote?, assignedTo? }` |
| `GET` | `/api/v1/products/admin/all` | ADMIN, MANAGER | All statuses |
| `POST` | `/api/v1/products` | ADMIN, MANAGER | `CreateProductDto` |
| `PATCH` | `/api/v1/products/:id` | ADMIN, MANAGER | Partial update |
| `DELETE` | `/api/v1/products/:id` | ADMIN | Hard delete |
| `POST` | `/api/v1/certifications` | ADMIN | `CreateCertificationDto` |
| `PATCH` | `/api/v1/certifications/:id` | ADMIN | Partial |
| `DELETE` | `/api/v1/certifications/:id` | ADMIN | Hard delete |
| `POST` | `/api/v1/media/upload` | ADMIN | `multipart/form-data` |
| `DELETE` | `/api/v1/media/:id` | ADMIN | Deletes from S3 + DB |
| `GET` | `/api/v1/users` | ADMIN | All users |
| `POST` | `/api/v1/users` | ADMIN | `CreateUserDto` |
| `PATCH` | `/api/v1/users/:id` | ADMIN | `UpdateUserDto` |
| `DELETE` | `/api/v1/users/:id` | ADMIN | Soft delete |

---

## 12. Known Bugs (Fix Before Launch)

### Bug 1 — Public product slug endpoint exposes inactive products

**File:** `src/products/products.service.ts` → `findBySlug()`

```typescript
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

```typescript
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

### Bug 3 — Media delete has no authorization check

**File:** `src/media/media.controller.ts`

```typescript
// Fixed:
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
remove(@Param('id') id: string) {
  return this.mediaService.delete(id);
}
```

---

### Bug 4 — Media key generation uses Math.random() (collision risk)

**File:** `src/media/media.service.ts`

```typescript
// Fixed:
import { randomUUID } from 'crypto';
const key = `uploads/${randomUUID()}.${ext}`;
```

---

### Bug 5 — Hero video has no fallback — renders black on load

**File:** `components/sections/Hero.tsx`

Add a working `poster` URL and an `<Image>` background behind the `<video>` element so the page is never fully black while the video loads or if video playback is unavailable.

---

## 13. Technical Debt (Prioritized)

### Phase D1 — Design fixes (current sprint, before any marketing)

| # | Issue | Fix | Reference |
|---|---|---|---|
| D1 | Hero padding inconsistency | `lg:px-24` → `lg:px-12` | §7 Issue D1 |
| D2 | Origin photo ivory fog | Remove `from-ivory/60` overlay | §7 Issue D2 |
| D3 | Logo stacking misaligned | Single-line DECCAN + HARVESTS | §7 Issue D3 |
| D4 | Process connecting line off | Remove SVG, use Cormorant numeral headers | §7 Issue D4 |
| D5 | Cert cards boxy | Horizontal register list with `divide-y` | §7 Issue D5 |
| D6 | RFQ form box wrapper | Remove `bg-black-rich/40 backdrop-blur-sm` | §7 Issue D6 |
| D7 | Contact page no narrative | Redesign with story arc | §7 Issue D7 |
| D8 | Hero has no image/video | Add interim Pexels fallback image | §7 Issue D8 |
| D9 | not-found.tsx / error.tsx missing | Create branded error pages | §7 Issue D10 |

### P1 — Fix before consistent team growth

| # | Item | File(s) | Fix |
|---|---|---|---|
| 1 | CountUp no `prefers-reduced-motion` check | `Metrics.tsx` | Add media query check |
| 2 | GSAP plugin re-registered on each render | `Process.tsx` | Register once at module level |
| 3 | Footer copyright year `2024` hardcoded | `Footer.tsx` | `new Date().getFullYear()` |
| 4 | Social links `href="#"` in Footer | `Footer.tsx` | Populate from constants or hide |
| 5 | No `loading.tsx` for async routes | `products/`, `quality/` | Add skeleton loading state |
| 6 | `app/not-found.tsx` missing | — | Phase D1 above |
| 7 | `app/error.tsx` missing | — | Phase D1 above |

### P2 — Fix before admin portal

| # | Item | Fix |
|---|---|---|
| 8 | `MediaFile.uploadedBy` is free string, not FK | Add `uploadedBy User @relation` — migration required |
| 9 | `RFQ.assignedTo` is free string, not FK | Same |
| 10 | Mobile menu doesn't trap focus | Add `focus-trap-react` or custom trap |
| 11 | Form inputs missing `aria-describedby` for errors | Update `InputField` in `RFQForm.tsx` |

### P3 — Fix before production launch

| # | Item | Notes |
|---|---|---|
| 12 | No sitemap.ts / robots.ts | Phase 6 |
| 13 | No JSON-LD structured data | Phase 6 |
| 14 | No OG image per product | Phase 6 |
| 15 | Notification emails have no retry | Add retry wrapper or Bull queue |
| 16 | RFQ status transitions unrestricted | Add allowed-transitions map in RfqService |

### P4 — Long-term hardening (post-launch)

| # | Item | Notes |
|---|---|---|
| 17 | No audit log for admin actions | Add `AuditLog` Prisma model |
| 18 | Refresh token: no rotation blacklist | Store refresh token hash in DB |
| 19 | No GDPR data export / right-to-erasure | Required for EU market |
| 20 | RFQ DTO: product should be ID, quantity should be number | Breaking change — coordinate frontend |
| 21 | No request correlation IDs in backend | Add logger middleware |

---

## 14. Remaining Roadmap

### Phase D1 — Design Remediation (do before any external sharing)

All issues from §7. Work in this order:

1. Fix Hero padding (`lg:px-24` → `lg:px-12`)
2. Fix Origin photo overlay (remove `from-ivory/60`)
3. Fix Logo alignment (single-line)
4. Fix Process section (remove SVG, use numeral headers)
5. Add Hero background image fallback (Pexels interim)
6. Redesign Certification section (horizontal register)
7. Remove RFQ form box wrapper
8. Redesign Contact page (narrative layout)
9. Create `not-found.tsx` + `error.tsx`

---

### Phase D2 — Product Card Editorial Upgrade (after D1)

- Featured first product in category filter (full-width horizontal card)
- Alternate card aspect ratios for visual rhythm
- Hover: product name slides to gold, image zooms to 1.04 (not 1.1 — too aggressive)
- Empty state: editorial message + sample request CTA

---

### Phase 6 — SEO & Metadata

All items are parallel — no blocking dependencies.

- [ ] `app/layout.tsx` — upgrade metadata object (metadataBase, title template, full openGraph, twitter card)
- [ ] `app/sitemap.ts` — static routes + all product slugs from API
- [ ] `app/robots.ts` — allow all, disallow `/admin`
- [ ] Product pages — `generateMetadata()` already in place; ensure OG description from `product.description`
- [ ] Homepage — add `Organization` JSON-LD schema
- [ ] Product detail — add `Product` JSON-LD schema
- [ ] LCP fix — Hero `<video>` needs poster fallback or `<Image>` behind it

---

### Phase 7 — Admin Portal

Build in this exact order (each item depends on the previous):

1. `app/admin/layout.tsx` — sidebar + topbar shell, auth check via `GET /auth/me`, redirect to `/admin/login` on 401
2. `app/admin/login/page.tsx` — login form → `POST /auth/login`
3. `app/admin/dashboard/page.tsx` — RFQ count by status, recent submissions
4. `app/admin/rfq/page.tsx` — paginated table, filter by status
5. `app/admin/rfq/[id]/page.tsx` — full RFQ detail, status update, internal notes
6. `app/admin/products/page.tsx` — product table with status badges
7. `app/admin/products/new/page.tsx` — create product form + image upload
8. `app/admin/products/[id]/page.tsx` — edit product
9. `app/admin/certifications/page.tsx` — cert list
10. `app/admin/certifications/new/page.tsx` — upload cert + PDF
11. `app/admin/media/page.tsx` — S3 media library
12. `app/admin/users/page.tsx` — user management (ADMIN role only)

**Admin design rules:**
- Same design tokens as public site. No external UI library (no shadcn, no MUI).
- Dark theme: `bg-black-deep` body, `bg-black-rich` sidebar, gold accents.
- RFQ status badge colors: `NEW` → gold · `IN_REVIEW` → blue/50 · `QUOTED` → green/50 · `CLOSED` → white/20.
- Tables: sortable columns, row hover `bg-black-rich`, inline status badges.
- Forms: same `InputField` + RHF + Zod pattern as public site.

---

### Phase 8 — Advanced (Deferred Until Post-Launch)

- **Page transitions** via `AnimatePresence` + `usePathname` — simple opacity fade, 300ms, no slide
- **Three.js particle field** in hero — ≤ 2000 gold particles at 12% opacity, subtle mouse parallax. Conditional: only render if `!prefersReducedMotion` and GPU tier ≥ 2 (via `detect-gpu`).
- **Spline 3D accent object** — pending asset. Replaces the static hero overlay.
- **Arabic i18n** via `next-intl` — right-to-left layout, Arabic Cormorant equivalent (Lateef or Amiri), UAE / Saudi / Qatar primary targets. All string constants must already be in `lib/constants.ts` — do not hardcode Arabic strings in components.

---

## 15. Environment Variables

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

## 16. Deployment

| Environment | Frontend | Backend |
|---|---|---|
| Local dev | `npm run dev` → `:3000` | `npm run start:dev` → `:4000` |
| Production | Vercel (recommended) — no `output: 'export'`, ISR requires serverless | Docker — `npm run start:prod` |

**Vercel config:**
- Set `NEXT_PUBLIC_API_URL` in project environment variables.
- `next.config.ts` has Pexels + Unsplash `remotePatterns`. Add S3 bucket domain before switching to real product images.
- Do not set `output: 'export'` — ISR/SSR won't work.

**Image migration (pre-launch):**
- All current product images use Pexels CDN URLs (from seed data).
- Before launch: upload real product photos via admin portal → they become S3 URLs → update via `PATCH /api/v1/products/:id`.
- Add S3 bucket domain to `next.config.ts` `remotePatterns` at that point.

**Content gaps blocking launch:**
- Real logo SVG (replace text logo)
- Hero drone footage (≤ 8MB MP4) or a strong hero photo poster
- Real product photography (8 products × minimum 1 image)
- Real certification PDFs for download links
- Real contact details: phone, email, address
- Real social media handles for Footer links
- Real metrics validation (20+ countries, 1000+ MT, 50+ partners, 15+ years)
