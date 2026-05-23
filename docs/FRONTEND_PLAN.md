# MULUKUTLA EXPORTS — Website Build Plan

## Brand Identity

**Company:** Mulukutla Exports / Deccan Harvests
**Tagline:** From the Fields of India to Global Markets
**Positioning:** Premium Guntur Chilli & Spice Exporter — B2B International
**Tone:** Elegant. Industrial. Agricultural. Global.

---

## Visual Identity (Derived from Reference)

### Color Palette

| Token           | Hex       | Usage                                      |
|-----------------|-----------|--------------------------------------------|
| `--gold`        | `#C9A84C` | Primary accent, borders, labels, CTAs      |
| `--gold-light`  | `#E8C97A` | Hover states, highlights                   |
| `--black-deep`  | `#0A0A0A` | Hero, product section, dark backgrounds    |
| `--black-rich`  | `#111111` | Footer, overlays                           |
| `--ivory`       | `#F5F0E8` | Light section backgrounds (metrics, certs) |
| `--ivory-dark`  | `#EDE8DC` | Cards, borders on light sections           |
| `--text-primary`| `#1A1A1A` | Body text on light sections                |
| `--text-muted`  | `#6B6560` | Subtext, captions                          |
| `--white`       | `#FAFAF8` | Text on dark backgrounds                   |
| `--red-chilli`  | `#A0291E` | Subtle accent only — do not overuse        |

### Typography

| Role         | Font                | Weight    | Notes                              |
|--------------|---------------------|-----------|------------------------------------|
| Display/H1   | Cormorant Garamond  | 300–400   | Thin, editorial — maximum elegance |
| H2 / H3      | Playfair Display    | 400–600   | Warm serif, trustworthy            |
| Body         | Inter               | 400       | Clean, professional, readable      |
| Labels/Caps  | Space Grotesk       | 500       | Eyebrow text, nav items, tags      |
| Numbers/Stat | Cormorant Garamond  | 300       | Large metrics look architectural   |

### Typography Scale (Desktop)

```
Display:  96–120px / line-height 0.95 / letter-spacing -0.02em
H1:       64–80px
H2:       40–52px
H3:       28–36px
Body:     16–18px / line-height 1.7
Label:    11–12px / letter-spacing 0.15em / UPPERCASE
```

---

## Tech Stack

### Core (Non-Negotiable)

| Package          | Version  | Purpose                         |
|------------------|----------|---------------------------------|
| Next.js          | 15.x     | App Router, SSR, image opt      |
| Tailwind CSS     | 4.x      | Utility styling                 |
| Framer Motion    | 11.x     | Component-level animations      |
| GSAP + ScrollTrigger | 3.x  | Cinematic scroll sequences      |
| Lenis            | latest   | Smooth scroll (replaces native) |
| React Hook Form  | 7.x      | RFQ / contact form              |
| Lucide React     | latest   | Minimal icon set                |

### Phase 2 (Post-launch)

| Package   | Purpose                    |
|-----------|----------------------------|
| Three.js  | Subtle particle / 3D       |
| Spline    | Interactive 3D hero object |

---

## Site Architecture

```
/                  → Homepage (primary experience)
/products          → Full product catalog with filters
/exports           → Export process, countries, logistics
/quality           → Certifications, testing, standards
/about             → Company story, founding, team, Guntur
/contact           → Full RFQ + contact info
```

---

## Homepage Section Breakdown

### 1. Navbar
- Transparent on load, solid `#0A0A0A` on scroll (Lenis scroll listener)
- Logo: "MULUKUTLA" wordmark (Space Grotesk / caps) + "EXPORTS" sub-label
- Links: Home | Products | Exports | Our Process | Quality | About Us | Contact
- CTA button: "Get a Quote" — gold border, transparent fill, fills gold on hover
- Mobile: Hamburger → fullscreen dark overlay nav

### 2. Hero — Cinematic Fullscreen
- **Background:** Autoplay muted looping MP4 (chilli drying fields / drone footage)
  - Fallback: high-quality still with parallax
- **Overlay:** `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))`
- **Grain texture:** CSS pseudo-element, 3% opacity — subtle film feel
- **Eyebrow:** "FROM THE FIELDS OF INDIA" — gold, Space Grotesk, uppercase, tracked
- **Headline:** "TO GLOBAL MARKETS" — Cormorant Garamond, 96–120px, white, thin weight
- **Subtext:** "Premium quality spices, sourced with care and exported with trust to the world."
- **CTAs:**
  - Primary: "Explore Our Products →" (gold filled button)
  - Secondary: "▶ Watch Our Story" (ghost, plays video modal)
- **Slide counter:** "01 / 05" bottom-left in Space Grotesk — elegant detail
- **Scroll indicator:** animated down chevron, fades out on scroll
- **Animation:** Headline word-by-word entrance (GSAP, stagger 0.1s, translateY 60px → 0)

### 3. Our Origin
- **Layout:** 50/50 split → left (text + chilli image), right (world map)
- **Label:** "OUR ORIGIN" in gold, uppercase tracked
- **Headline:** "Rooted in Guntur, Trusted Worldwide" — Playfair Display
- **Body:** Guntur region story — fertile soil, climate, legacy
- **Map:** SVG world map with animated arc lines from Guntur → US, EU, Middle East, SE Asia
  - Arcs animate on section enter (GSAP drawSVG or CSS stroke-dashoffset)
  - Guntur pin pulses (CSS animation)
  - Label: "Exporting to 20+ Countries Across 4 Continents"
- **CTA:** "Discover Our Origin →" gold underline link
- **Background:** Ivory (`#F5F0E8`)

### 4. Products — Premium Quality, Naturally
- **Background:** Deep black (`#0A0A0A`)
- **Label:** "OUR PRODUCTS" gold, uppercase
- **Headline:** "Premium Quality, Naturally" — Playfair Display, white
- **Top right:** "View All Products →" link
- **Product Cards (5):**
  1. Teja Chilli — High pungency, vibrant color and rich aroma
  2. Byadgi Chilli — Known for its deep red color and mild heat
  3. Turmeric — Rich in curcumin and golden in color
  4. Coffee Beans — Sourced from the finest plantations
  5. Spice Powders — Hygienic ground spices with natural oils
- **Card anatomy:**
  - Square image (macro shot, object-cover)
  - Product name (Playfair, white)
  - Short descriptor (Inter, muted)
  - Arrow CTA (gold circle)
  - Hover: subtle scale(1.03), gold border appears, image brightens slightly
- **Animation:** Cards stagger-enter on scroll (Framer Motion, opacity + translateY)

### 5. Metrics Bar
- **Background:** Ivory
- **4 stats in a row:**
  - 20+ Countries Exported
  - 1000+ Tons Delivered
  - 50+ Global Partners
  - 100% Quality Assured  ← Replace with "15+ Years Experience" (more credible)
- **Each stat:** Large Cormorant Garamond number (gold) + label (Space Grotesk, dark)
- **Icons:** Thin line icons (Lucide) above each number
- **Animation:** CountUp on scroll enter (Framer Motion useInView + spring)

### 6. Our Process
- **Layout:** 60% left (steps) / 40% right (shipping container image, cinematic)
- **Label:** "OUR PROCESS" gold, uppercase
- **Headline:** "From Farm to World With Care"
- **Steps (horizontal, numbered):**
  ```
  01 Farming → 02 Sorting → 03 Drying → 04 Quality Testing → 05 Packaging → 06 Shipping
  ```
  - Each step: icon + number + title + 1-line description
  - Active step highlights in gold (GSAP ScrollTrigger scrub)
  - Connecting line animates left-to-right as user scrolls
- **Right image:** Shipping container / port at golden hour — cinematic crop
- **Background:** Dark (`#111111`)

### 7. Trust — Quality You Can Trust
- **Background:** Ivory
- **Label:** "CERTIFICATIONS"
- **Headline:** "Quality You Can Trust"
- **Certification badges (4):**
  - ISO 22000
  - HACCP Certified
  - APEDA Registered
  - USDA Organic (if applicable)
- **Each badge:** Circle icon + name + subtitle ("Food Safety Management" etc.)
- **Right side or below:** Global reach map (dark background panel)

### 8. Gallery — Cinematic Grid
- **Layout:** Masonry / asymmetric grid (3–4 columns)
- **Images:** Macro chilli shots, drying fields, sorting workers, containers, warehouse, packaging
- **Hover:** Slight scale + overlay with location/caption text
- **This section is purely visual — no heavy text**
- **Background:** Black

### 9. Contact / RFQ — Let's Grow Together
- **This gets full-width treatment — not a cramped column**
- **Background:** Deep chilli red (`#8B1E14`) or deep black with gold accents
- **Label:** "REQUEST A QUOTE"
- **Headline:** "Let's Grow Together"
- **Form fields:**
  - Your Name | Email Address
  - Country (dropdown with flags) | Product Interest (dropdown)
  - Estimated Quantity | Your Message
  - Submit: "Send Request →" — gold filled button
- **Left side:** Company contact details (phone, email, address) + social links
- **Validation:** React Hook Form + Zod
- **Success state:** Inline thank-you message (no page reload)

### 10. Footer
- **4 columns:** Logo + tagline | Quick Links | Company | Contact
- **Bottom bar:** © 2024 Mulukutla Exports. All rights reserved. + Social icons
- **Background:** `#0A0A0A`
- **Separator:** Thin gold line above footer

---

## Animation Philosophy

| Scenario               | Tool            | Style                                           |
|------------------------|-----------------|-------------------------------------------------|
| Hero headline enter    | GSAP            | Words slide up from 60px, stagger 0.1s          |
| Section headings       | Framer Motion   | Fade + translateY(30px), on viewport enter      |
| Cards                  | Framer Motion   | Stagger children, 0.08s delay each             |
| Metrics countup        | Framer Motion   | Spring animation, triggers once on enter        |
| Process timeline       | GSAP ScrollTrig | Scrub-based, line draws as user scrolls         |
| World map arcs         | CSS / GSAP      | stroke-dashoffset animation on enter            |
| Smooth scroll          | Lenis           | All page scroll — easing: 0.08, duration: 1.2  |
| Navbar transition      | Framer Motion   | Opacity + backdrop-blur on scroll threshold     |
| Page transitions       | Framer Motion   | Fade out/in between routes                      |

**Rules:**
- No bounce easing anywhere. Use `easeOut` or `easeInOut` only.
- No animations under 300ms (feels cheap) or over 1200ms (feels slow).
- All animations must respect `prefers-reduced-motion`.

---

## Performance Rules

| Rule                         | Implementation                                      |
|------------------------------|-----------------------------------------------------|
| Hero video                   | Max 8MB, H.264, serve via CDN, poster= fallback     |
| All images                   | Next.js `<Image>` component, WebP, lazy load        |
| Fonts                        | `next/font` with `display: swap`                    |
| GSAP                         | Import only used plugins, no global registration    |
| Lenis                        | Initialize in layout, not per-page                  |
| Bundle                       | Analyze with `@next/bundle-analyzer` before deploy  |
| Core Web Vitals target       | LCP < 2.5s, CLS < 0.1, INP < 200ms                 |

---

## Build Order

### Phase 1 — Scaffold & Foundation
- [ ] Init Next.js 15 project with App Router
- [ ] Configure Tailwind v4 with custom design tokens
- [ ] Install and wire Lenis, GSAP, Framer Motion
- [ ] Create layout with Navbar + Footer shell
- [ ] Set up Google Fonts (Cormorant Garamond, Playfair Display, Inter, Space Grotesk)
- [ ] Global CSS: grain texture, scroll behavior, base resets

### Phase 2 — Hero + Navbar
- [ ] Navbar (transparent → solid, mobile menu)
- [ ] Hero section (video background, overlay, headline animation, CTAs)

### Phase 3 — Core Homepage Sections
- [ ] Origin section (split layout + SVG world map)
- [ ] Products section (dark, card grid, hover effects)
- [ ] Metrics bar (countup animation)
- [ ] Process timeline (scroll-driven, GSAP)

### Phase 4 — Trust + Gallery + RFQ
- [ ] Certifications / Trust section
- [ ] Cinematic gallery grid
- [ ] RFQ / Contact form (full-width, React Hook Form)
- [ ] Footer

### Phase 5 — Inner Pages
- [ ] /products — full catalog
- [ ] /about — company story
- [ ] /quality — certifications detail
- [ ] /contact — standalone contact

### Phase 6 — Polish & Performance
- [ ] Mobile responsiveness pass (all sections)
- [ ] Animation fine-tuning
- [ ] Image optimization + lazy loading
- [ ] Bundle analysis + code splitting
- [ ] SEO: metadata, OpenGraph, sitemap
- [ ] Lighthouse audit — target 90+ all categories

---

## Content Checklist (To Fill In)

| Item                   | Status     | Notes                          |
|------------------------|------------|--------------------------------|
| Company logo           | Needed     | SVG preferred                  |
| Hero video             | Placeholder| Use Pexels drone chilli video  |
| Product images         | Placeholder| Pexels/Unsplash macro spices   |
| Exact product list     | Needed     | Teja, Byadgi + others?         |
| Real metrics           | Needed     | Countries, tons, partners      |
| Certifications         | Needed     | Which ones do you hold?        |
| Export countries list  | Needed     | For map + trust section        |
| Contact details        | Needed     | Phone, email, address          |
| Founder/team info      | Optional   | For About page                 |
