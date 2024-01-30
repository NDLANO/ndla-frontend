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
        names: [
          'myNdlaData',
          'alerts',
          'frontpageData',
          'mastheadProgramme',
          'mastheadFrontpage',
        ],
        fixture: 'multidisciplinary_frontpage',
      },
      {
        names: ['multidisciplinarySubjectPage', 'mastHead'],
        fixture: 'multidisciplinary_page',
      },
    ],
  });
  await page.goto('/?disableSSR=true');
});

test('contains content', async ({ page }) => {
  await mockWaitResponse(page, '**/graphql-api/graphql*');
  await page.getByRole('button').getByText('Meny').click();
  await page
    .getByRole('menuitem', { name: 'Tverrfaglige tema' })
    .first()
    .click();
  await page.waitForURL('/subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7');
  await mockWaitResponse(page, '**/graphql-api/graphql*');
  await page.waitForLoadState();
  const heading = page.getByRole('heading').getByText('Tverrfaglige temaer');
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();
});
