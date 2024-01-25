/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockGraphqlRoute, mockWaitResponse } from '../apiMock';

test('topic contains content', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [{ names: ['iframePage'], fixture: 'iframeTopic' }],
  });
  await page.goto('/article-iframe/nb/urn:topic:2:170165/2?disableSSR=true');
  await mockWaitResponse(page, '**/graphql-api/*');
  const heading = page
    .getByRole('heading')
    .getByText('Samfunnsfaglige tenkemåter');
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual('Samfunnsfaglige tenkemåter');
});

test('resource contains content', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [{ names: ['iframePage'], fixture: 'iframeResource' }],
  });
  await page.goto('/article-iframe/nb/urn:resource:1:124037/3?disableSSR=true');
  await mockWaitResponse(page, '**/graphql-api/*');
  const heading = page
    .getByRole('heading')
    .getByText('Meninger og kunnskap om samfunnet')
    .first();
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual(
    'Meninger og kunnskap om samfunnet',
  );
});

test('oembed contains content', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [{ names: ['iframePage'], fixture: 'iframeOembed' }],
  });
  await page.goto('/article-iframe/nb/article/4?disableSSR=true');
  await mockWaitResponse(page, '**/graphql-api/*');
  const heading = page
    .getByRole('heading')
    .getByText('Medier og informasjonskilder');
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual('Medier og informasjonskilder');
  const div = page.getByText('Ressursen er hentet fra NDLA');
  expect(await div.isVisible()).toBeTruthy();
});
