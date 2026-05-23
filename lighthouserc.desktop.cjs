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
        // Desktop is faster — tighten the CWV budgets
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
