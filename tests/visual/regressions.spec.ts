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
          // ignore grain overlay (fixed, intentionally full-viewport)
          if ((el as HTMLElement).classList.contains('grain')) return false;
          return r.right > vw + 1 && r.width <= vw * 2;
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
    // Scroll to Metrics section (sits after #products)
    await page.locator('#products + section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000); // CounterUp duration is 2.2s + buffer
    const values = await page.evaluate(() => {
      const statSection = document.querySelector('#products + section');
      if (!statSection) return [];
      return Array.from(statSection.querySelectorAll('p, span'))
        .map((s) => s.textContent?.trim() ?? '')
        .filter((t) => /^\d/.test(t));
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
        const transparentBg =
          cs.backgroundColor === 'rgba(0, 0, 0, 0)' ||
          cs.backgroundColor === 'transparent';
        const noBorder = (['border-top', 'border-right', 'border-bottom', 'border-left'] as const)
          .every((p) => cs.getPropertyValue(`${p}-width`) === '0px');
        if (transparentBg && noBorder) bad.push((el as HTMLElement).outerHTML.slice(0, 80));
      });
      return bad;
    });
    expect(issues).toEqual([]);
  });

  test('hero headline is fully inside the viewport', async ({ page }) => {
    // Headline spans are the large clamp text inside the first section
    const headline = page.locator('section').first().locator('[class*="clamp"]').first();
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
          bad.push(
            `${rects[i].id} overlaps ${rects[i + 1].id} by ${Math.round(rects[i].bottom - rects[i + 1].top)}px`
          );
        }
      }
      return bad;
    });
    expect(overlaps).toEqual([]);
  });
});
