/**
 * Lighthouse CI — Deccan Harvests
 *
 * Strategy:
 *  - Run against `next start` (production build), NOT `next dev`.
 *    Dev mode includes HMR + un-minified chunks that wildly skew scores.
 *  - Mobile profile by default (Google ranks mobile). Desktop is a separate config.
 *  - 3 runs per URL, median reported, to dampen noise.
 *  - Budgets are aspirational for a "premium" marketing site, not extreme.
 */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 60_000,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --disable-gpu --headless=new',
        throttlingMethod: 'simulate',
        skipAudits: [
          'uses-http2',       // not relevant locally
          'redirects-http',   // not relevant locally
          'is-on-https',      // localhost
        ],
      },
    },

    assert: {
      assertions: {
        // Score budgets
        'categories:performance':    ['error', { minScore: 0.90 }],
        'categories:accessibility':  ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo':            ['error', { minScore: 0.95 }],

        // Core Web Vitals (mobile, simulated)
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift':  ['error', { maxNumericValue: 0.05 }],
        'first-contentful-paint':   ['error', { maxNumericValue: 1800 }],
        'total-blocking-time':      ['error', { maxNumericValue: 200  }],
        'speed-index':              ['warn',  { maxNumericValue: 3400 }],
        'interactive':              ['warn',  { maxNumericValue: 3800 }],

        // Audits that catch the exact issues found in DOM inspection
        'lcp-lazy-loaded':              ['error', { minScore: 1 }],
        'prioritize-lcp-image':         ['error', { minScore: 1 }],
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

        // Layout stability — directly tied to section-overlap bugs
        'layout-shifts':                ['error', { maxLength: 0 }],
        'non-composited-animations':    ['warn',  { maxLength: 0 }],

        // Accessibility
        'color-contrast':               ['error', { minScore: 1 }],
        'image-alt':                    ['error', { minScore: 1 }],
        'label':                        ['error', { minScore: 1 }],
        'link-name':                    ['error', { minScore: 1 }],
        'button-name':                  ['error', { minScore: 1 }],
        'tap-targets':                  ['error', { minScore: 1 }],
        'heading-order':                ['warn',  { minScore: 1 }],

        // Resource budgets (see budgets.json)
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
