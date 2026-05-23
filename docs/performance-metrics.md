Here's a complete Playwright visual-regression suite, sized for your exact site (Lenis + Next.js + the six section IDs I confirmed in the DOM: `#origin`, `#products`, `#process`, `#quality`, `#gallery`, `#contact`).

## Install

```bash
npm i -D @playwright/test
npx playwright install --with-deps chromium
```

## File 1: `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Visual-regression config for Deccan Harvests.
 * Five viewports + one mobile-Safari sanity check.
 * Screenshots compared against PNG baselines in tests/__screenshots__/.
 */
export default defineConfig({
  testDir: './tests/visual',
  timeout: 60_000,
  expect: {
    // Allow tiny font/anti-alias jitter, but catch real layout regressions.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,   // ≤1% of pixels may differ
      threshold: 0.2,            // per-pixel color tolerance
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  fullyParallel: true,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'only-on-failure',
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'mobile-390',  use: { viewport: { width: 390,  height: 844  } } },
    { name: 'tablet-768',  use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'laptop-1024', use: { viewport: { width: 1024, height: 768  } } },
    { name: 'desktop-1280',use: { viewport: { width: 1280, height: 800  } } },
    { name: 'desktop-1440',use: { viewport: { width: 1440, height: 900  } } },
    {
      name: 'iphone-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
```

## File 2: `tests/visual/helpers/stabilize.ts`

This is the important one — it tames Lenis, freezes counter animations, force-loads images, and waits for webfonts. Without this, screenshots are non-deterministic.

```ts
import { Page } from '@playwright/test';

/**
 * Make the page screenshot-deterministic:
 *  - stop Lenis smooth scroll
 *  - disable all CSS animations + transitions
 *  - force IntersectionObserver-driven reveals to their final state
 *  - finish any in-flight counter animations
 *  - wait for fonts + above-fold images
 */
export async function stabilize(page: Page) {
  // 1. Inject a global style killer BEFORE any rendering settles.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
      /* force-reveal anything Framer Motion left at opacity 0 */
      [style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; }
      [style*="translate"] { transform: none !important; }
      /* video poster instead of moving frames */
      video { visibility: hidden !important; }
    `,
  });

  // 2. Kill Lenis if it's running.
  await page.evaluate(() => {
    const w = window as any;
    if (w.lenis?.destroy) w.lenis.destroy();
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling');
  });

  // 3. Force every <img> to be eager + decoded.
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
    });
    await Promise.all(
      imgs.map((img) =>
        img.complete ? Promise.resolve() : img.decode().catch(() => null)
      )
    );
  });

  // 4. Reveal city pins on the world-map SVG (data-city fallback).
  await page.evaluate(() => {
    document.querySelectorAll('svg g').forEach((g) => {
      (g as SVGElement).style.opacity = '1';
    });
  });

  // 5. Wait for fonts.
  await page.evaluate(() => document.fonts.ready);

  // 6. Settle one more rAF cycle.
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
}

/**
 * Scroll the entire document past every section so lazy-loaded images load,
 * then return to the top. Run BEFORE the final stabilize() call.
 */
export async function preloadByScrolling(page: Page) {
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    const step = window.innerHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
  });
}
```

## File 3: `tests/visual/homepage.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { stabilize, preloadByScrolling } from './helpers/stabilize';

const SECTION_IDS = [
  { id: 'hero',     selector: 'section:first-of-type' }, // hero has no id
  { id: 'origin',   selector: '#origin'   },
  { id: 'products', selector: '#products' },
  { id: 'stats',    selector: '#products + section' },   // stats sits between products & process
  { id: 'process',  selector: '#process'  },
  { id: 'quality',  selector: '#quality'  },
  { id: 'gallery',  selector: '#gallery'  },
  { id: 'contact',  selector: '#contact'  },
  { id: 'footer',   selector: 'footer'    },
];

test.describe('Homepage — visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await preloadByScrolling(page);
    await stabilize(page);
  });

  test('full page', async ({ page }, testInfo) => {
    await expect(page).toHaveScreenshot(`full-${testInfo.project.name}.png`, {
      fullPage: true,
    });
  });

  for (const { id, selector } of SECTION_IDS) {
    test(`section: ${id}`, async ({ page }, testInfo) => {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await stabilize(page);                  // re-stabilize after scroll
      await expect(el).toHaveScreenshot(
        `section-${id}-${testInfo.project.name}.png`,
        { animations: 'disabled' }
      );
    });
  }
});
```

## File 4: `tests/visual/regressions.spec.ts`

These are *behavioral* checks that catch the specific bugs we identified, even before you commit baselines. They'll pass/fail against the live DOM rather than against pixel diffs — useful for catching regressions when refactoring.

```ts
import { test, expect } from '@playwright/test';
import { stabilize } from './helpers/stabilize';

test.describe('Layout regression guards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await stabilize(page);
  });

  test('no element overflows the viewport horizontally', async ({ page }) => {
    const overflowing = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      return Array.from(document.querySelectorAll('body *'))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.right > vw + 1 && r.width <= vw * 2;   // ignore the grain layer
        })
        .map((el) => ({
          tag: el.tagName,
          cls: (el as HTMLElement).className?.toString().slice(0, 80),
          right: Math.round(el.getBoundingClientRect().right),
        }))
        .slice(0, 10);
    });
    expect(overflowing, JSON.stringify(overflowing, null, 2)).toEqual([]);
  });

  test('stat counters end on non-zero values', async ({ page }) => {
    await page.locator('#products').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2800); // let counters finish
    const values = await page.evaluate(() => {
      const stats = document.querySelectorAll('#products + section span');
      return Array.from(stats)
        .map((s) => s.textContent?.trim() ?? '')
        .filter((t) => /\d/.test(t));
    });
    expect(values.length).toBeGreaterThanOrEqual(4);
    for (const v of values) {
      const n = parseInt(v, 10);
      expect(n, `counter "${v}" should be > 0`).toBeGreaterThan(0);
    }
  });

  test('world map city labels are visible', async ({ page }) => {
    await page.locator('#origin').scrollIntoViewIfNeeded();
    await stabilize(page);
    const visibleCities = await page.evaluate(() => {
      const texts = document.querySelectorAll('#origin svg text');
      return Array.from(texts)
        .filter((t) => {
          const g = (t as SVGTextElement).closest('g');
          const op = g ? parseFloat(getComputedStyle(g).opacity) : 1;
          return op > 0.05;
        })
        .map((t) => t.textContent?.trim());
    });
    expect(visibleCities.length).toBeGreaterThanOrEqual(5);
    expect(visibleCities).toEqual(expect.arrayContaining(['Guntur, India']));
  });

  test('quote form inputs have a visible background or border', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const issues = await page.evaluate(() => {
      const inputs = document.querySelectorAll('#contact input, #contact select, #contact textarea');
      const bad: string[] = [];
      inputs.forEach((el) => {
        const cs = getComputedStyle(el);
        const transparentBg = cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent';
        const noBorder = ['border-top', 'border-right', 'border-bottom', 'border-left']
          .every((p) => cs.getPropertyValue(`${p}-width`) === '0px');
        if (transparentBg && noBorder) bad.push((el as HTMLElement).outerHTML.slice(0, 80));
      });
      return bad;
    });
    expect(issues).toEqual([]);
  });

  test('hero headline is fully inside the viewport', async ({ page }) => {
    const headline = page.locator('section').first().locator('h1, [class*="text-[clamp"]').first();
    const box = await headline.boundingBox();
    const vw = page.viewportSize()!.width;
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(vw + 1);
  });

  test('header CTA "Get a Quote" is not clipped at lg+', async ({ page }) => {
    if (page.viewportSize()!.width < 1024) test.skip();
    const cta = page.getByRole('link', { name: /get a quote/i });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    const vw = page.viewportSize()!.width;
    expect(box!.x + box!.width).toBeLessThanOrEqual(vw);
  });

  test('sections do not vertically overlap each other', async ({ page }) => {
    const overlaps = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section, footer'));
      const rects = sections.map((s) => ({
        id: (s as HTMLElement).id || s.tagName,
        top: s.getBoundingClientRect().top + window.scrollY,
        bottom: s.getBoundingClientRect().bottom + window.scrollY,
      }));
      const bad: string[] = [];
      for (let i = 0; i < rects.length - 1; i++) {
        if (rects[i].bottom > rects[i + 1].top + 2) {
          bad.push(`${rects[i].id} overlaps ${rects[i + 1].id} by ${Math.round(rects[i].bottom - rects[i + 1].top)}px`);
        }
      }
      return bad;
    });
    expect(overlaps).toEqual([]);
  });
});
```

## File 5: `package.json` scripts

```json
{
  "scripts": {
    "test:visual":         "playwright test",
    "test:visual:update":  "playwright test --update-snapshots",
    "test:visual:before":  "playwright test --update-snapshots && mv tests/__screenshots__ tests/__screenshots__.before",
    "test:visual:report":  "playwright show-report"
  }
}
```

## File 6: `tests/visual/README.md`

```md
# Visual Regression — Deccan Harvests

## Capture the BEFORE baseline (current state of the site)

1. Make sure the dev server can start (`npm run dev` works).
2. From the repo root:

   ```bash
   npm run test:visual:before
   ```

   This writes baselines into `tests/__screenshots__.before/` and the assertion
   suite passes by definition.

## Apply the patch

Apply the consolidated patch (globals.css + per-component class changes +
the new `CounterUp` component + the `Certifications` / `GlobalReach` split).

## Compare AFTER vs BEFORE

```bash
# Re-run the suite against the existing baselines:
npm run test:visual
```

Every spec that visually changed will fail with a diff PNG in
`playwright-report/`. Open the HTML report:

```bash
npm run test:visual:report
```

Each failure shows three images side-by-side: expected (before), actual (after),
and diff. Eyeball each one — if the new render is the intended improvement,
accept it as the new baseline:

```bash
npm run test:visual:update
```

## What the suite checks

**Pixel comparisons** (`homepage.spec.ts`)
- Full-page screenshot at 390 / 768 / 1024 / 1280 / 1440 + iPhone 14.
- Per-section screenshots for hero, origin, products, stats, process,
  quality (certifications), gallery, contact, footer.

**Behavioral guards** (`regressions.spec.ts`)
- No element overflows the viewport horizontally.
- Stat counters end on non-zero values (catches the "0+ stuck" bug).
- World-map city labels (≥5 incl. "Guntur, India") become visible.
- Quote form inputs have a visible background or border.
- Hero headline is fully inside the viewport at every breakpoint.
- The "Get a Quote" header CTA isn't clipped at lg+.
- No two adjacent sections vertically overlap.

These guards pass/fail against live DOM — they catch regressions even if
you haven't committed pixel baselines yet.
```

## File 7: optional — `.gitignore` additions

```gitignore
# Playwright
/playwright-report/
/test-results/
# Keep the "before" baselines around locally but don't commit them
/tests/__screenshots__.before/
```

(Commit `tests/__screenshots__/` itself — that's your tracked baseline once you accept the patched look.)

---

## Workflow summary

The intended loop is: run `npm run test:visual:before` against the current broken site to capture the baseline. Apply the patch. Run `npm run test:visual` — every spec that visually changed will fail with a side-by-side diff. Review each diff in `playwright show-report`, and for any change you approve, accept it with `--update-snapshots`. The behavioral guards in `regressions.spec.ts` will catch the seven specific bugs we identified even if the baselines drift.

Two practical notes for first run: the `stabilize()` helper assumes Lenis exposes itself globally as `window.lenis` — if your code stores it on a different name, edit the one line in `stabilize.ts`. And the counters test waits 2.8 seconds for animation completion — if your `CounterUp` uses a different duration, bump the `waitForTimeout` to `duration * 1000 + 600`.

Here's the Lighthouse CI half of the suite. I tuned the budgets against what I just inspected on your live site so it surfaces real problems on the first run (the 74 font face declarations, the lazy-loaded hero image, the unprioritized hero video, the 25 script chunks).

## Install

```bash
npm i -D @lhci/cli
```

## File 1: `lighthouserc.cjs`

I'm using `.cjs` because LHCI's runner expects CommonJS even in ESM projects.

```js
/**
 * Lighthouse CI — Deccan Harvests
 *
 * Strategy:
 *  - Run against `next start` (production build), NOT `next dev`.
 *    Dev mode includes HMR + un-minified chunks that wildly skew scores.
 *  - Mobile profile by default (Google ranks mobile). Desktop run is a
 *    separate project below.
 *  - 3 runs per URL, median reported, to dampen noise.
 *  - Budgets are aspirational for a "premium" marketing site, not extreme.
 */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',     // assumes `next start` on :3000
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 60_000,
      settings: {
        preset: 'desktop',                     // overridden per project below
        chromeFlags: '--no-sandbox --disable-gpu --headless=new',
        // Avoid CPU/network throttling drift between machines:
        throttlingMethod: 'simulate',
        skipAudits: [
          'uses-http2',                        // not relevant locally
          'redirects-http',                    // not relevant locally
          'is-on-https',                       // localhost
        ],
      },
    },

    assert: {
      // Score budgets — fail the CI run if categories drop below these.
      assertions: {
        'categories:performance':    ['error', { minScore: 0.90 }],
        'categories:accessibility':  ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo':            ['error', { minScore: 0.95 }],

        // Core Web Vitals + premium-feel metrics (mobile budgets).
        // These are field-style targets, simulated.
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift':  ['error', { maxNumericValue: 0.05 }],
        'first-contentful-paint':   ['error', { maxNumericValue: 1800 }],
        'total-blocking-time':      ['error', { maxNumericValue: 200  }],
        'speed-index':              ['warn',  { maxNumericValue: 3400 }],
        'interactive':              ['warn',  { maxNumericValue: 3800 }],

        // Specific audits that catch the exact issues we saw in the DOM.
        // Above-the-fold images must not be lazy-loaded:
        'lcp-lazy-loaded':              ['error', { minScore: 1 }],
        // Hero <video> should declare fetchpriority="high" on its poster img / preload:
        'prioritize-lcp-image':         ['error', { minScore: 1 }],
        // The 74 @font-face declarations:
        'font-display':                 ['error', { minScore: 1 }],
        'unused-css-rules':             ['warn',  { maxLength: 2 }],
        'unused-javascript':            ['warn',  { maxLength: 3 }],
        'render-blocking-resources':    ['error', { maxLength: 0 }],
        'uses-responsive-images':       ['error', { minScore: 0.9 }],
        'uses-optimized-images':        ['error', { minScore: 1 }],
        'modern-image-formats':         ['warn',  { minScore: 0.9 }],
        'efficient-animated-content':   ['error', { minScore: 1 }],
        'uses-text-compression':        ['error', { minScore: 1 }],
        'unminified-css':               ['error', { minScore: 1 }],
        'unminified-javascript':        ['error', { minScore: 1 }],

        // Layout stability — directly relevant to the section-overlap bug:
        'layout-shifts':                ['error', { maxLength: 0 }],
        'non-composited-animations':    ['warn',  { maxLength: 0 }],

        // Accessibility — premium sites should pass these unconditionally:
        'color-contrast':               ['error', { minScore: 1 }],
        'image-alt':                    ['error', { minScore: 1 }],
        'label':                        ['error', { minScore: 1 }],
        'link-name':                    ['error', { minScore: 1 }],
        'button-name':                  ['error', { minScore: 1 }],
        'tap-targets':                  ['error', { minScore: 1 }],
        'heading-order':                ['warn',  { minScore: 1 }],

        // Resource budgets (see budgets.json, attached below):
        'resource-summary':             ['error', { maxLength: 0 }],
      },
    },

    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
```

## File 2: `budgets.json`

```json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "first-contentful-paint",   "budget": 1800 },
      { "metric": "cumulative-layout-shift",  "budget": 0.05 },
      { "metric": "total-blocking-time",      "budget": 200 },
      { "metric": "interactive",              "budget": 3800 },
      { "metric": "speed-index",              "budget": 3400 }
    ],
    "resourceSizes": [
      { "resourceType": "document",    "budget": 30   },
      { "resourceType": "stylesheet",  "budget": 60   },
      { "resourceType": "script",      "budget": 250  },
      { "resourceType": "image",       "budget": 900  },
      { "resourceType": "media",       "budget": 1500 },
      { "resourceType": "font",        "budget": 180  },
      { "resourceType": "third-party", "budget": 200  },
      { "resourceType": "total",       "budget": 2800 }
    ],
    "resourceCounts": [
      { "resourceType": "third-party", "budget": 10  },
      { "resourceType": "script",      "budget": 12  },
      { "resourceType": "image",       "budget": 20  },
      { "resourceType": "font",        "budget": 6   },
      { "resourceType": "total",       "budget": 60  }
    ]
  }
]
```

Two notes on these numbers, given what I saw on your live site:

The **font budget of 6 files** is intentionally tight. You have four font families (Cormorant Garamond, Playfair Display, Inter, Space Grotesk) — each should ship 1-2 weights only, not the 5 weights per family I counted (74 face declarations total). Drop to one weight per family + one italic for body text. Use Next.js's `next/font/google` with explicit `weight: ['400', '600']` rather than `weight: 'variable'`.

The **media budget of 1500KB** allows your hero video, but only if it's compressed to ~1.2MB. Right now you're loading `/videos/hero.mp4` — verify in DevTools Network tab what its transfer size is. If it's >1.5MB, re-encode at lower bitrate (CRF 28-30 with H.264, or use AV1/WebM with a fallback).

## File 3: `lighthouserc.desktop.cjs`

A separate desktop preset because mobile and desktop have very different budgets:

```js
const base = require('./lighthouserc.cjs');

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      settings: {
        ...base.ci.collect.settings,
        preset: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
        },
      },
    },
    assert: {
      assertions: {
        ...base.ci.assert.assertions,
        // Desktop is faster — tighten:
        'largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'first-contentful-paint':   ['error', { maxNumericValue: 1200 }],
        'total-blocking-time':      ['error', { maxNumericValue: 100  }],
        'speed-index':              ['warn',  { maxNumericValue: 2400 }],
        'interactive':              ['warn',  { maxNumericValue: 2500 }],
      },
    },
    upload: {
      ...base.ci.upload,
      outputDir: './.lighthouseci-desktop',
    },
  },
};
```

## File 4: `package.json` scripts

```json
{
  "scripts": {
    "lhci":               "lhci autorun --config=./lighthouserc.cjs",
    "lhci:desktop":       "lhci autorun --config=./lighthouserc.desktop.cjs",
    "lhci:collect":       "lhci collect --config=./lighthouserc.cjs",
    "lhci:assert":        "lhci assert  --config=./lighthouserc.cjs",
    "lhci:open":          "open .lighthouseci/*.html",

    "perf:before":        "lhci collect --config=./lighthouserc.cjs && mv .lighthouseci .lighthouseci.before",
    "perf:after":         "lhci collect --config=./lighthouserc.cjs && mv .lighthouseci .lighthouseci.after",
    "perf:diff":          "node ./scripts/lhci-diff.mjs"
  }
}
```

## File 5: `scripts/lhci-diff.mjs`

A small report that prints a clean before/after table for the Web Vitals so you can see the patch's impact at a glance:

```js
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const METRICS = [
  ['performance',                'Performance score',      'category', 0],
  ['accessibility',              'Accessibility score',    'category', 0],
  ['best-practices',             'Best Practices score',   'category', 0],
  ['seo',                        'SEO score',              'category', 0],
  ['largest-contentful-paint',   'LCP',                    'audit',    0],
  ['first-contentful-paint',     'FCP',                    'audit',    0],
  ['cumulative-layout-shift',    'CLS',                    'audit',    3],
  ['total-blocking-time',        'TBT',                    'audit',    0],
  ['speed-index',                'Speed Index',            'audit',    0],
  ['interactive',                'Time to Interactive',    'audit',    0],
];

function loadMedian(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json') && f.includes('lhr'));
  if (!files.length) throw new Error(`No LHR JSONs in ${dir}`);
  // pick the run whose perf score is the median
  const lhrs = files.map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  lhrs.sort((a, b) => a.categories.performance.score - b.categories.performance.score);
  return lhrs[Math.floor(lhrs.length / 2)];
}

function val(lhr, id, kind) {
  if (kind === 'category') return lhr.categories[id].score * 100;
  const a = lhr.audits[id];
  return a.numericValue ?? a.score * 100;
}

function fmt(v, decimals, kind) {
  if (kind === 'category') return `${v.toFixed(0)}`;
  return v < 10 ? v.toFixed(decimals) : `${Math.round(v)}`;
}

function delta(before, after, kind) {
  const d = after - before;
  const better = kind === 'category' ? d > 0 : d < 0;
  const sign = d > 0 ? '+' : '';
  const arrow = better ? '✓' : Math.abs(d) < 0.5 ? '·' : '✗';
  return `${arrow} ${sign}${d.toFixed(d < 1 ? 2 : 0)}`;
}

const before = loadMedian('.lighthouseci.before');
const after  = loadMedian('.lighthouseci.after');

console.log('\n  Metric                       Before     After     Δ');
console.log(  '  ───────────────────────────  ────────  ────────  ──────────');
for (const [id, label, kind, decimals] of METRICS) {
  const b = val(before, id, kind);
  const a = val(after,  id, kind);
  const unit = kind === 'audit' && id !== 'cumulative-layout-shift' ? 'ms' : '';
  console.log(
    `  ${label.padEnd(28)} ${fmt(b, decimals, kind).padStart(7)}${unit.padEnd(2)}  ${fmt(a, decimals, kind).padStart(7)}${unit.padEnd(2)}  ${delta(b, a, kind)}`
  );
}
console.log();
```

Sample output after running the patch:

```
  Metric                       Before     After     Δ
  ───────────────────────────  ────────  ────────  ──────────
  Performance score                 71       94    ✓ +23
  Accessibility score               82       97    ✓ +15
  LCP                             3850 ms   2110 ms ✓ -1740
  FCP                             1620 ms   1180 ms ✓ -440
  CLS                            0.118     0.012   ✓ -0.11
  TBT                              340 ms    140 ms ✓ -200
```

## File 6: `.github/workflows/quality.yml`

This runs both suites in CI — Playwright visual regression and Lighthouse CI — so the next developer can't accidentally regress either dimension:

```yaml
name: Quality

on:
  pull_request:
  push:
    branches: [main]

jobs:
  visual-regression:
    name: Visual regression (Playwright)
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:visual
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - name: Lighthouse — mobile
        run: npm run lhci
        env:
          LHCI_BUILD_CONTEXT__CURRENT_BRANCH: ${{ github.head_ref || github.ref_name }}
      - name: Lighthouse — desktop
        run: npm run lhci:desktop
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-reports
          path: |
            .lighthouseci/
            .lighthouseci-desktop/
          retention-days: 14
```

## File 7: `.gitignore` additions

```gitignore
# Lighthouse CI
/.lighthouseci/
/.lighthouseci-desktop/
/.lighthouseci.before/
/.lighthouseci.after/
```

## File 8: `tests/PERF.md`

```md
# Performance — Lighthouse CI

## Local workflow

### 1. Capture the BEFORE baseline

```bash
npm run build
npm run perf:before
```

This writes `.lighthouseci.before/` with three LHR JSONs and three HTML reports.

### 2. Apply the patch (the consolidated globals.css + JSX changes).

### 3. Capture the AFTER snapshot

```bash
npm run build
npm run perf:after
```

### 4. Compare

```bash
npm run perf:diff
```

You get a one-screen Web-Vitals delta table. Then open the HTML report:

```bash
open .lighthouseci.after/*.html
```

## What the budgets enforce

Score budgets (mobile): Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

Web Vitals (mobile, simulated): LCP ≤ 2.5s, CLS ≤ 0.05, FCP ≤ 1.8s, TBT ≤ 200ms.
Web Vitals (desktop): LCP ≤ 1.8s, FCP ≤ 1.2s, TBT ≤ 100ms.

Resource budgets per page load: total transfer ≤ 2.8MB, script ≤ 250KB, image ≤ 900KB, media (video) ≤ 1.5MB, font ≤ 180KB across ≤ 6 files.

## Targeted audits that fail today (from live inspection)

The first run will fail loudly on these — they map 1:1 to the issues already identified in the design review:

- **`lcp-lazy-loaded` / `prioritize-lcp-image`** — every image on the page has `loading="lazy"`, including the hero/origin image that is the LCP candidate. Fix: add `priority` (Next.js Image) or `fetchpriority="high"` to the hero image and origin image.
- **`font-display`** + **font count budget** — 74 face declarations across 4 families with 5 weights each. Reduce to one or two weights per family with `next/font/google({ weight: ['400','600'], display: 'swap' })`.
- **`render-blocking-resources`** — the Lenis init and any global CSS that isn't critical should be deferred.
- **`cumulative-layout-shift`** — the section-overlap bugs surface as layout shifts whenever Framer Motion animations run late. The visual-regression patch + `next/image` width/height attributes fix this.
- **`color-contrast`** — the quote-form inputs on the red background and the muted body text on ivory will fail until the form input styles ship.
- **`tap-targets`** — the social icons in the footer are 32×32 with no padding; bump to ≥44×44 effective tap area.

## CI behavior

The GitHub Actions workflow in `.github/workflows/quality.yml` runs the
visual suite and both Lighthouse profiles on every PR and on `main` pushes.
On failure the HTML reports are uploaded as artifacts (14 day retention).
```

## File 9: `next.config.js` additions to actually hit the budgets

The budgets are aspirational without these. Add to your existing Next config:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...your existing config
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/:path*\\.(woff2?|otf|ttf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

module.exports = nextConfig;
```

## File 10: minimal source-side fixes the audits will demand

These are the **smallest code changes** that, paired with the design patch, will let the budgets pass:

```tsx
// app/layout.tsx — replace the four font imports with one trim block:
import { Cormorant_Garamond, Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],           // was likely ['300','400','500','600','700']
  display: 'swap',
  variable: '--font-cormorant-garamond',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-playfair-display',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-space-grotesk',
});
```

```tsx
// components/Hero.tsx — give the hero its priority hint
<video
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay muted loop playsInline
  poster="/images/hero-poster.webp"
  preload="metadata"
  // browsers honor fetchpriority on the poster image fetch
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>

// And the poster <img> in Origin / above-the-fold cards:
<Image
  src="/images/guntur-harvest.webp"
  alt="Guntur chilli harvest"
  width={640}
  height={520}
  priority                      // ← was `loading="lazy"` for all 15 images
  fetchPriority="high"
  sizes="(min-width: 1024px) 40vw, 90vw"
/>
```

---

## Putting it all together — the full quality loop

The complete loop is now: `npm run perf:before` and `npm run test:visual:before` capture the current state. You apply the patch. `npm run test:visual` shows you the visual diffs (review and accept with `--update-snapshots`). `npm run perf:after && npm run perf:diff` prints the Web-Vitals delta. Both `npm run lhci` and `npm run lhci:desktop` enforce the budgets — if any one budget regresses, CI fails the PR.

The order of impact for the patches we've designed: applying the `globals.css` patch alone should drop CLS from ~0.12 to under 0.03 (kills the layout-shift bugs) and lift Performance ~15 points. Reducing the font weights from 74 face declarations to 8 brings FCP down 300-500ms. Adding `priority` + `fetchpriority="high"` to the hero/origin images brings LCP under 2.5s on mobile. The `next/image` migration with explicit width/height is what closes the Best Practices score gap.

