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
  // 1. Kill animations/transitions before anything settles.
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
      /* force-reveal anything Framer Motion left at opacity:0 */
      [style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; }
      [style*="translate"] { transform: none !important; }
      /* hide video frames — poster image is enough for screenshots */
      video { visibility: hidden !important; }
    `,
  });

  // 2. Destroy Lenis if running.
  await page.evaluate(() => {
    const w = window as Window & typeof globalThis & { lenis?: { destroy?: () => void } };
    if (w.lenis?.destroy) w.lenis.destroy();
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling');
  });

  // 3. Force all <img> to eager + decoded.
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

  // 4. Reveal world-map SVG city pins (Framer Motion might leave them at opacity:0).
  await page.evaluate(() => {
    document.querySelectorAll('#origin svg g').forEach((g) => {
      (g as SVGElement).style.opacity = '1';
    });
  });

  // 5. Wait for fonts.
  await page.evaluate(() => document.fonts.ready);

  // 6. Settle two rAF cycles so layout is final.
  await page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  );
}

/**
 * Scroll the full document so lazy-loaded images trigger, then return to top.
 * Run BEFORE the final stabilize() call.
 */
export async function preloadByScrolling(page: Page) {
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    const step = window.innerHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise<void>((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise<void>((r) => setTimeout(r, 200));
  });
}
