import { defineConfig } from 'cypress';

export default defineConfig({
  fixturesFolder: 'cypress/e2e/fixtures',
  screenshotsFolder: 'cypress/e2e/screenshots',
  videosFolder: 'cypress/e2e/videos',
  chromeWebSecurity: false,
  video: false,
  projectId: '7d39xm',
  defaultCommandTimeout: 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/e2e/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/e2e/support/index.ts',
  },
});
