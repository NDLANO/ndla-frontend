/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  maxFailures: process.env.CI ? 10 : undefined,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 2,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'specs',
      testMatch: 'e2e/**/*.spec.ts',
      use: {
        viewport: {
          width: 2560,
          height: 1440,
        },
      },
    },
  ],

  // Automatically run against prod-build on CI for speed and accuracy.
  webServer: process.env.CI
    ? {
        command: 'cross-env NODE_ENV=production node build/server.mjs',
        port: 3000,
      }
    : undefined,
});
