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
  await page.goto('/?disableSSR=true');
});

test('shows students', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        names: [
          'myNdlaData',
          'alerts',
          'mastheadFrontpage',
          'mastheadProgramme',
          'frontpageData',
        ],
        fixture: 'toolbox',
      },
      {
        names: ['toolboxSubjectPage', 'mastHead'],
        fixture: 'toolbox_subject_students',
      },
    ],
  });

  await page.getByRole('button', { name: 'Meny' }).click();
  await page
    .getByRole('menuitem', { name: 'Verktøykassa - for elever' })
    .click();
  await mockWaitResponse(page, '**/graphql-api/*');
  expect(
    page.getByRole('heading', { name: 'Verktøykassa – for elever' }),
  ).toBeVisible();

  await expect(page.getByTestId('nav-box-item')).toHaveCount(16);

  const links = await page
    .getByTestId('nav-box-list')
    .getByRole('listitem')
    .getByRole('link')
    .all();

  expect(links.length).toEqual(16);
});

test('shows teachers', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        names: [
          'myNdlaData',
          'alerts',
          'mastheadFrontpage',
          'mastheadProgramme',
          'frontpageData',
        ],
        fixture: 'toolbox',
      },
      {
        names: ['toolboxSubjectPage', 'mastHead'],
        fixture: 'toolbox_subject_teachers',
      },
    ],
  });

  await page.getByRole('button', { name: 'Meny' }).click();
  await page
    .getByRole('menuitem', { name: 'Verktøykassa - for lærere' })
    .click();
  await mockWaitResponse(page, '**/graphql-api/*');
  expect(
    page.getByRole('heading', { name: 'Verktøykassa – for lærere' }),
  ).toBeVisible();

  await expect(page.getByTestId('nav-box-item')).toHaveCount(13);

  const links = await page
    .getByTestId('nav-box-list')
    .getByRole('listitem')
    .getByRole('link')
    .all();

  expect(links.length).toEqual(13);
});
