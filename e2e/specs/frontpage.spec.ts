/**
 * Copyright (c) 2016-present, NDLA.
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
    operationNames: [
      'myNdlaData',
      'alerts',
      'frontpageData',
      'mastheadProgramme',
      'mastheadFrontpage',
    ],
    fixture: 'frontpage',
  });
  await page.goto('/?disableSSR=true');
  await mockWaitResponse(page, '**/graphql-api/*');
});

test('should have list of valid links on frontpage', async ({ page }) => {
  const programmes = await page
    .getByTestId('programme-list')
    .getByRole('navigation')
    .getByRole('link')
    .all();

  expect(programmes.length).toEqual(16);

  programmes.forEach((locator) => {
    expect(locator.getAttribute('href')).toBeDefined();
    expect(locator.allInnerTexts()).toBeDefined();
  });
});

test('show have functioning language box', async ({ page }) => {
  await mockWaitResponse(page, '**/graphql-api/*');
  await page.getByRole('button', { name: 'Velg språk' }).first().click();

  expect(
    page.locator('[data-radix-popper-content-wrapper]').getByText('Bokmål'),
  ).toBeTruthy();

  await page
    .locator('[data-radix-popper-content-wrapper]')
    .getByText('Nynorsk')
    .click();

  await expect(
    page.getByRole('button', { name: 'Vel språk' }).first(),
  ).toBeVisible();

  expect(page.url().includes('/nn/')).toBeTruthy();
});
