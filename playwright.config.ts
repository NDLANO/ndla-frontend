/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from '@playwright/test';
import { join } from 'path';

export const STORAGE_STATE = join(__dirname, 'e2e/.auth/teacher.json');

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
    viewport: {
      width: 2560,
      height: 1440,
    },
  },
  projects: [
    { name: 'setup', testMatch: 'e2e/auth.setup.ts' },
    {
      name: 'NDLA specs',
      testMatch: 'e2e/specs/unauthenticated/*.spec.ts',
    },
    {
      name: 'MyNdla specs',
      testMatch: 'e2e/specs/authenticated/*.spec.ts',
      dependencies: ['setup'],
      use: {
        permissions: ['clipboard-read', 'clipboard-write'],
        storageState: STORAGE_STATE,
      },
    },
  ],

  // Automatically run against prod-build on CI for speed and accuracy.
  webServer: process.env.CI
    ? {
        command: 'cross-env NODE_ENV=production node build/server',
        port: 3000,
      }
    : undefined,
});
