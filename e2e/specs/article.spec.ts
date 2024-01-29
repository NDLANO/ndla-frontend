/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockGraphqlRoute, mockWaitResponse } from '../apiMock';

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        names: [
          'myNdlaData',
          'plainArticlePage',
          'alerts',
          'mastheadFrontpage',
          'mastheadProgramme',
        ],
        fixture: 'article',
      },
    ],
  });
  await page.goto('/article/1/?disableSSR=true');
});

test('contains content', async ({ page }) => {
  const heading = page.getByRole('heading').getByText('Utforskeren');
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();
});
