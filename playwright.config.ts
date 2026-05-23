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
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
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
    { name: 'mobile-390',   use: { viewport: { width: 390,  height: 844  } } },
    { name: 'tablet-768',   use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'laptop-1024',  use: { viewport: { width: 1024, height: 768  } } },
    { name: 'desktop-1280', use: { viewport: { width: 1280, height: 800  } } },
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900  } } },
    {
      // Uses Chromium with iPhone 14 device profile (viewport, UA, touch, DPR).
      // Switch to `...devices['iPhone 14']` in CI where WebKit is available.
      name: 'iphone-mobile',
      use: {
        viewport:        devices['iPhone 14'].viewport,
        userAgent:       devices['iPhone 14'].userAgent,
        deviceScaleFactor: devices['iPhone 14'].deviceScaleFactor,
        isMobile:        true,
        hasTouch:        true,
      },
    },
  ],
});
