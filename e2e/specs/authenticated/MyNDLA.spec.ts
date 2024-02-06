/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockGraphqlRoute, mockWaitResponse } from '../../apiMock';

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        fixture: 'minndla_home_myndladata',
        names: ['myNdlaData', 'recentlyUsed'],
      },
      {
        fixture: 'minndla_home_data',
        names: [
          'folderResourceMetaSearch',
          'arenaRecentTopicsV2',
          'arenaNotificationsV2',
        ],
      },
      {
        fixture: 'minndla_home_folder',
        names: ['foldersPage'],
      },
      {
        fixture: 'minndla_home_arena',
        names: ['arenaPage2'],
      },
    ],
  });
  await page.goto('/minndla');
});

test('have recently added to folder', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Nylig lagt til i mine mapper' }),
  ).toBeInViewport();
  await mockWaitResponse(page, '**/graphql-api/graphql');
  expect(
    await page
      .getByRole('main')
      .locator('section')
      .first()
      .getByRole('listitem')
      .count(),
  ).toBeGreaterThanOrEqual(1);

  const toFolder = page.getByRole('link').getByText('Se alle mappene dine');
  await expect(toFolder).toBeInViewport();
  await toFolder.click();
  await page.waitForURL('/minndla/folders');
  await expect(
    page.getByRole('heading', { name: 'Mine mapper' }),
  ).toBeInViewport();
});

test('have new posts in arena', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Nye innlegg i arena' }),
  ).toBeInViewport();

  expect(
    await page
      .getByRole('main')
      .locator('section')
      .nth(1)
      .getByRole('listitem')
      .count(),
  ).toBeGreaterThanOrEqual(1);

  const toArena = page.getByRole('link').getByText('Se alle innlegg i arena');
  await expect(toArena).toBeInViewport();
  await toArena.click();
  await page.waitForURL('/minndla/arena');
  await expect(page.getByRole('heading', { name: 'Arena' })).toBeInViewport();
});
