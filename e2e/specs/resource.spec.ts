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
          'resourcePage',
          'alerts',
          'mastHead',
          'mastheadFrontpage',
          'mastheadProgramme',
        ],
        fixture: 'resource',
      },
    ],
  });
  await page.goto(
    '/subject:1:94dfe81f-9e11-45fc-ab5a-fba63784d48e/topic:2:117982/resource:1:117868?disableSSR=true',
  );
});

test('contains content', async ({ page }) => {
  await mockWaitResponse(page, '**/graphql-api/*');
  await expect(page.getByRole('navigation').getByRole('listitem')).toHaveCount(
    4,
  );
  await expect(
    page.getByRole('navigation').getByRole('listitem').getByRole('link'),
  ).toHaveCount(3);

  const heading = page.getByRole('heading').getByText('Muntlig eksamen MIK 1');
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();

  const rules = page.getByRole('button').getByText('Regler for bruk');
  expect(rules).toBeDefined();
  await expect(rules).toBeVisible();
});
