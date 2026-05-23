# Deccan Harvests — Frontend Roadmap

**Brand:** Deccan Harvests (trade name) | **Legal:** Mulukutla Exports Pvt. Ltd
**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Framer Motion · GSAP + ScrollTrigger · Lenis
**Backend:** NestJS 11 · Prisma 5 · PostgreSQL · JWT HttpOnly cookies → `http://localhost:4000`

---

## Current State — Phase 1–4 Complete

The homepage is fully built and wired to the backend. All 10 sections are live.

| Section | File | Status |
|---|---|---|
| Navbar | `components/layout/Navbar.tsx` | Done — transparent→solid scroll, mobile overlay |
| Hero | `components/sections/Hero.tsx` | Done — video bg, GSAP word entrance, scroll indicator |
| Origin | `components/sections/Origin.tsx` | Done — SVG world map arcs, Guntur pin pulse |
| Products | `components/sections/Products.tsx` | Done — 5 static cards, stagger animation |
| Metrics | `components/sections/Metrics.tsx` | Done — CountUp on viewport enter |
| Process | `components/sections/Process.tsx` | Done — GSAP ScrollTrigger line draw, 6 steps |
| Certifications | `components/sections/Certifications.tsx` | Done — static badges + country tags |
| Gallery | `components/sections/Gallery.tsx` | Done — masonry grid, Pexels CDN |
| RFQ | `components/sections/RFQ.tsx` | Done — wired to `POST /api/v1/rfq`, error + success states |
| Footer | `components/layout/Footer.tsx` | Done — 4-column, inline SVG social icons |

**Infrastructure:**
- Design tokens in `app/globals.css` via Tailwind v4 `@theme` block
- Film grain overlay (fixed, `z-9999`, `pointer-events: none`)
- Lenis + GSAP ticker integrated in `components/providers/SmoothScrollProvider.tsx`
- `prefers-reduced-motion` respected globally

---

## Phase 5 — Inner Pages

Each inner page shares the global Navbar + Footer and the same design language.
All data is fetched server-side via `fetch()` with Next.js cache — no client-side waterfalls.

### 5.1 `/products` — Product Catalog

**Purpose:** Let buyers browse the full product range, filter by category, and click through to detail.

**Layout:**
- Hero banner — thin, dark, with eyebrow "Our Products" + headline
- Filter bar — category chips (`All | Chillies | Turmeric | Coffee | Spice Powders`), active chip in gold
- Product grid — 3-col desktop, 2-col tablet, 1-col mobile
- Each card: image (16:9), product name, short descriptor, SHU range (for chillies), gold "View Details →" link

**Data source:** `GET /api/v1/products` → returns `ProductStatus.ACTIVE` products with `images[]`

**Routing:** Each card links to `/products/[slug]`

**Empty state:** "Coming Soon — More products launching soon." with RFQ CTA

**Key implementation notes:**
- Use `generateStaticParams` + `revalidate: 3600` (ISR) — products change infrequently
- Images via `<Image>` with `sizes` prop for responsive srcset
- Filter state in URL search params (`?category=chillies`) — bookmark-safe, no client JS required for initial render

---

### 5.2 `/products/[slug]` — Product Detail

**Purpose:** Full product specification sheet — gives buyers everything they need to make a purchasing decision.

**Layout:**
- Left column (60%): image gallery (main image + thumbnail strip, lightbox on click)
- Right column (40%): product name, variety label, full description, spec table, "Request Quote" CTA
- Spec table rows (show only if value present):
  | Field | Source |
  |---|---|
  | Variety | `product.variety` |
  | SHU Range | `product.shuMin` – `product.shuMax` |
  | ASTA Color Value | `product.astaValue` |
  | Moisture | `product.moisture` |
  | Available Formats | hardcoded per product family (whole, powder, flakes) |
  | Certifications | link to `/quality` |
- Below fold: "You may also like" — 3 other active products (exclude current)
- Sticky bottom bar (mobile only): product name + "Get a Quote" button

**Data source:** `GET /api/v1/products/slug/:slug`

**Key implementation notes:**
- `generateStaticParams` fetches all slugs at build time
- `notFound()` if slug returns 404 from API
- Lightbox: use `framer-motion` `AnimatePresence` overlay — no third-party lightbox library

---

### 5.3 `/about` — Our Story

**Purpose:** Build trust with international buyers. Who is behind this brand, where, and why.

**Sections (top to bottom):**
1. **Hero** — full-width image of Guntur fields, headline "From the Heart of Guntur"
2. **Founding story** — 2-column: text left, founder portrait right (placeholder until real photo provided)
3. **The Guntur Advantage** — why Guntur chilli is globally prized (climate, soil, legacy) — text + map graphic reuse from Origin
4. **Our Values** — 3 cards: Transparency · Consistency · Traceability
5. **By the numbers** — reuse Metrics component
6. **Team** (optional, hide if content not provided) — simple name + role cards
7. **CTA strip** — "Ready to source from us?" → links to `/contact`

**Data:** Fully static (no API call needed). Content hardcoded until CMS is added.

---

### 5.4 `/quality` — Certifications & Standards

**Purpose:** Compliance-focused page for buyers whose procurement requires documented food safety proof.

**Layout:**
- Intro: "We hold ourselves to the highest international standards"
- Certification cards (pull from `GET /api/v1/certifications` — `active: true`):
  - Badge icon + cert name + issuing body + cert number + validity dates
  - "Download Certificate" button → links to `cert.fileUrl` (S3 presigned URL)
- Testing standards section (static): SHU testing, moisture measurement, color grading (ASTA), pesticide residue limits
- Export compliance section (static): APEDA, FSSAI, Phytosanitary certificates explained
- CTA: "Need documentation for your procurement? Contact us."

**Data source:** `GET /api/v1/certifications` (public, no auth)

**Key notes:**
- If `expiresAt` is within 30 days, show a "Renewal pending" badge (frontend calculation only)
- If no certifications exist in DB yet, render static placeholder cards matching the Certifications homepage section

---

### 5.5 `/contact` — Standalone Contact & RFQ

**Purpose:** Deep-linked destination for "Get a Quote" CTAs from all pages.

**Layout:**
- Full-width, chilli-red background (same as homepage RFQ section)
- Left: Company contact details, Google Maps embed (static iframe, `loading="lazy"`)
- Right: Full RFQ form (reuse `<RFQ>` section component, extract form as `<RFQForm>`)
- Below fold: FAQ accordion — 5-6 common buyer questions (MOQ, lead time, payment terms, Incoterms)

**Key notes:**
- Extract the form from `RFQ.tsx` into a shared `components/ui/RFQForm.tsx` so both homepage and `/contact` use the same component without duplication
- Google Maps embed: `https://maps.google.com/maps?q=Guntur,Andhra+Pradesh&output=embed` — no API key needed for basic embed

---

## Phase 6 — SEO & Performance

### 6.1 Metadata (Next.js Metadata API)

Every page exports a `metadata` object or `generateMetadata` function.

**Global defaults in `app/layout.tsx`:**
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://deccanharvests.com'),
  title: { default: 'Deccan Harvests | Premium Spice Exports from India', template: '%s | Deccan Harvests' },
  description: 'Premium Guntur chilli, turmeric and spice exports to 20+ countries. B2B exporter with ISO 22000 certification. Request a quote.',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'Deccan Harvests' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
```

**Per-page overrides:**
- `/products/[slug]` — dynamic OG title + description from `product.name` + `product.description`
- `/about`, `/quality`, `/contact` — static overrides with page-specific descriptions

### 6.2 Sitemap & Robots

- `app/sitemap.ts` — static routes + all product slugs fetched from API
- `app/robots.ts` — allow all, disallow `/admin`

### 6.3 Structured Data

Add `application/ld+json` to homepage and product pages:
- Homepage: `Organization` schema (name, url, logo, contactPoint, address)
- Product pages: `Product` schema (name, description, brand, offers placeholder)

### 6.4 Performance Targets

| Metric | Target | Current risk |
|---|---|---|
| LCP | < 2.5s | Hero video — ensure `poster` image is WebP, preloaded |
| CLS | < 0.1 | Image dimensions must be explicit — never layout-shifting |
| INP | < 200ms | GSAP + Framer Motion are JS-heavy — profile on low-end device |
| Bundle (JS) | < 200kB first load | GSAP is ~75kB — use dynamic import for ScrollTrigger |
| Core Web Vitals | All green | Run `next build` Lighthouse in CI |

**Action items:**
- Hero video: max 8MB, H.264, served via CDN (Cloudflare / S3 + CloudFront), `preload="none"` on mobile
- Replace all `images.pexels.com` CDN URLs with real product photos when available
- Run `npx @next/bundle-analyzer` — identify and lazy-load heavy sections
- Add `loading="lazy"` and explicit `width`/`height` on all non-hero `<Image>` uses

### 6.5 Accessibility

- All interactive elements have visible focus rings
- Color contrast ratios: gold `#C9A84C` on black `#0A0A0A` = 5.2:1 (passes AA for large text, borderline normal — check with axe)
- `<video>` in Hero must have `aria-label` and a visible skip link
- All form inputs in RFQ have associated `<label>` elements (currently done via `InputField` wrapper)
- Test with VoiceOver (macOS) before launch

---

## Phase 7 — Admin Portal

All admin routes live under `app/admin/` as a Next.js Route Group with a shared admin layout.
Auth is checked client-side on mount via `GET /api/v1/auth/me` — redirect to `/admin/login` if 401.
JWT is stored as HttpOnly cookie — no localStorage.

### 7.1 Route Structure

```
app/
  admin/
    layout.tsx         ← Admin shell: sidebar + topbar, checks auth
    login/
      page.tsx         ← Login form → POST /api/v1/auth/login
    dashboard/
      page.tsx         ← Stats overview: RFQ counts by status, recent submissions
    rfq/
      page.tsx         ← RFQ table: paginated, filterable by status
      [id]/
        page.tsx       ← RFQ detail: full form data, status update, internal notes
    products/
      page.tsx         ← Product list: table with status badges, edit/delete actions
      new/
        page.tsx       ← Create product: form + image upload → S3
      [id]/
        page.tsx       ← Edit product
    certifications/
      page.tsx         ← Certifications list
      new/
        page.tsx       ← Upload certification + PDF → S3
    media/
      page.tsx         ← S3 media library (view + delete uploaded files)
    users/
      page.tsx         ← User management (ADMIN role only)
```

### 7.2 Admin API Contracts

| Action | Endpoint | Auth |
|---|---|---|
| Login | `POST /api/v1/auth/login` | Public |
| Current user | `GET /api/v1/auth/me` | Any authenticated |
| List RFQs (paginated) | `GET /api/v1/rfq?page=1&limit=20` | ADMIN / MANAGER |
| Update RFQ status | `PATCH /api/v1/rfq/:id/status` | ADMIN / MANAGER |
| List all products | `GET /api/v1/products/admin/all` | ADMIN |
| Create product | `POST /api/v1/products` | ADMIN |
| Update product | `PATCH /api/v1/products/:id` | ADMIN |
| Delete product | `DELETE /api/v1/products/:id` | ADMIN |
| Upload media | `POST /api/v1/media/upload` | ADMIN |
| Delete media | `DELETE /api/v1/media/:id` | ADMIN |
| List certifications | `GET /api/v1/certifications/admin/all` | ADMIN |
| Create certification | `POST /api/v1/certifications` | ADMIN |

### 7.3 Admin Design

- Minimal dark theme: `#0A0A0A` bg, `#1A1A1A` sidebar, gold accent
- No external UI library — keep it consistent with the brand using Tailwind primitives
- Tables: sortable columns, row hover in `#1A1A1A`, status badges with semantic colors
  - `NEW` → gold · `IN_REVIEW` → blue · `QUOTED` → green · `CLOSED` → gray
- Forms: same `InputField` pattern as the public site

---

## Phase 8 — Advanced Enhancements

These are intentionally deferred until the core site is live and performing well.

### 8.1 Page Transitions

Wrap route content in `<AnimatePresence>` at the layout level.
Use a simple fade — opacity 0→1 over 400ms. No slide (causes scroll position issues).

```tsx
// app/layout.tsx addition
<AnimatePresence mode="wait">
  <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
    {children}
  </motion.div>
</AnimatePresence>
```

Requires `"use client"` wrapper with `usePathname()` — isolate to a `PageTransition` provider.

### 8.2 Three.js Particle Background

Light particle field in the Hero or Origin section — subtle depth, not distracting.
Use `@react-three/fiber` + `@react-three/drei`. Dynamic import with `ssr: false`.
Particle count: ≤ 2000. Color: gold `#C9A84C` at 15% opacity. Respond to mouse position.
Fallback: plain black background if WebGL unavailable.

**Defer until:** Post-launch performance audit confirms headroom for additional JS.

### 8.3 Spline 3D Hero Object

Replace or overlay the hero video with a Spline 3D chilli or spice object.
Use `@splinetool/react-spline` with `dynamic import + ssr: false`.
**Defer until:** 3D asset is designed and Spline scene file is ready.

### 8.4 i18n — Arabic (RTL)

Middle East is a primary export market (UAE, Saudi, Qatar, Kuwait, Bahrain, Oman).
Add Arabic language support using Next.js i18n routing (`/ar/`).
RTL: Tailwind has `rtl:` variant — no separate stylesheet needed.
Translation: JSON files in `messages/en.json`, `messages/ar.json`.
Use `next-intl` (lightweight, App Router compatible).

**Scope:** Homepage + Products + Contact. Admin stays English-only.

---

## Content Gaps — Blocking Launch

The following must be provided before production launch. Placeholders are currently in use.

| Item | Current Placeholder | Required |
|---|---|---|
| Logo | "DECCAN HARVESTS" text wordmark | SVG file — wordmark + icon variant |
| Hero video | No video (section needs `<video>` tag added) | MP4, H.264, ≤ 8MB, 1920×1080, chilli fields / drone footage |
| Product images | Pexels CDN URLs | Real macro shots per product — min 4 per product |
| Metrics numbers | `20+ Countries`, `1000+ MT`, `50+ Partners` | Verified real figures |
| Certifications | Static display only | Cert names, numbers, dates, PDF files → upload via admin |
| Contact phone | `+91 98765 43210` (placeholder) | Real number |
| Contact email | `exports@deccanharvests.com` | Verified inbox |
| Physical address | `Guntur, Andhra Pradesh` | Full address for footer + contact page |
| Founder name & photo | Not shown | Optional — for About page |
| Social handles | Icons present, no links | Instagram, LinkedIn, YouTube URLs |

---

## Design System Constraints — Do Not Break

These are locked decisions. Any new page or component must follow these rules.

**Colors:** Only use tokens from `globals.css @theme`. Never hardcode hex values.

**Typography hierarchy:**
- `font-cormorant` → display headings, large metrics numbers only
- `font-playfair` → section H2/H3 headings
- `font-inter` → all body text, form inputs, descriptions
- `font-space-grotesk` → labels, eyebrows, nav links, button text, tags

**Animation rules:**
- No bounce easing anywhere. Only `easeOut`, `easeInOut`, or `--ease-cinema` / `--ease-smooth` tokens.
- Minimum duration: 300ms. Maximum: 1200ms.
- All scroll-triggered animations: `once: true` (do not replay on scroll back)
- All `useInView` hooks: `margin: "-60px"` to trigger slightly before visible
- Never animate `width` or `height` directly — use `scaleX`/`scaleY` or `clipPath` for performance

**Component patterns:**
- Extract to a named component if used 2+ times across pages
- No inline `style` objects for colors or spacing — use Tailwind classes
- `"use client"` only on components that need browser APIs or event handlers. Default to Server Components.
- Images: always `<Image>` from `next/image`. Never `<img>`. Always provide `alt`.

**Form pattern (RFQForm):**
- React Hook Form + Zod resolver
- `InputField` wrapper component handles label + error display
- Gold submit button, disabled + opacity-60 while submitting
- Inline success/error states — never navigate away or reload

---

## Environment Variables

```bash
# .env.local (not committed — copy from .env.example)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production, set `NEXT_PUBLIC_API_URL=https://api.deccanharvests.com`.

---

## Deployment Notes

| Environment | Frontend | Backend |
|---|---|---|
| Local dev | `npm run dev` → `:3000` | `npm run start:dev` → `:4000` |
| Production | Vercel (recommended) or Docker | Docker — see `Dockerfile` in backend repo |

**Vercel config:**
- Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
- `next.config.ts` already has `remotePatterns` for `images.pexels.com` — add production S3 bucket domain when switching to real images
- No `output: 'export'` — ISR requires serverless functions
