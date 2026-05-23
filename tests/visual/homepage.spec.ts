import { test, expect } from '@playwright/test';
import { stabilize, preloadByScrolling } from './helpers/stabilize';

const SECTION_IDS = [
  { id: 'hero',          selector: 'section:first-of-type' },
  { id: 'origin',        selector: '#origin'         },
  { id: 'products',      selector: '#products'       },
  { id: 'stats',         selector: '#products + section' }, // Metrics sits between Products & Process
  { id: 'process',       selector: '#process'        },
  { id: 'certifications',selector: '#certifications' },
  { id: 'reach',         selector: '#reach'          },
  { id: 'gallery',       selector: '#gallery'        },
  { id: 'contact',       selector: '#contact'        },
  { id: 'footer',        selector: 'footer'          },
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
      await stabilize(page); // re-stabilize after scroll to settle any lazy reveals
      await expect(el).toHaveScreenshot(
        `section-${id}-${testInfo.project.name}.png`,
        { animations: 'disabled' }
      );
    });
  }
});
