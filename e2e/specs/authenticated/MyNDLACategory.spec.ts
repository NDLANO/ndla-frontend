/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockGraphqlRoute } from '../../apiMock';

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        fixture: 'minndla_category_myndladata',
        names: ['myNdlaData', 'arenaPage2'],
      },
      {
        fixture: 'minndla_category_notifications',
        names: ['arenaNotificationsV2'],
      },
      {
        fixture: 'minndla_category_topics',
        names: ['arenaCategoryV2'],
      },
    ],
  });
  await page.goto('/minndla/arena');
});

test('has categories and is working link', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Arena' })).toBeInViewport();

  expect(
    await page.getByRole('main').getByRole('listitem').count(),
  ).toBeGreaterThanOrEqual(1);

  const link = page
    .getByRole('main')
    .getByRole('listitem')
    .getByRole('link')
    .first();
  const linkHeading = (await link.textContent()) ?? '';
  await link.click();
  await page.waitForURL('/minndla/arena/category/*');
  await expect(
    page.getByRole('main').getByRole('heading', { name: linkHeading }),
  ).toHaveText(linkHeading);
});
