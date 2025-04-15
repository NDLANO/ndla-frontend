/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test("topic contains content", async ({ page, waitGraphql }) => {
  await page.goto("/article-iframe/nb/urn:topic:2:170165/2?disableSSR=true");
  await waitGraphql();
  const heading = page.getByRole("heading").getByText("Samfunnsfaglige tenkemåter");
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual("Samfunnsfaglige tenkemåter");
});

test("resource contains content", async ({ page, waitGraphql }) => {
  await page.goto("/article-iframe/nb/urn:resource:1:124037/3?disableSSR=true");
  await waitGraphql();
  const heading = page.getByRole("heading").getByText("Meninger og kunnskap om samfunnet").first();
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual("Meninger og kunnskap om samfunnet");
});

test("oembed contains content", async ({ page, waitGraphql }) => {
  await page.goto("/article-iframe/nb/article/4?disableSSR=true");
  await waitGraphql();
  const heading = page.getByRole("heading").getByText("Medier og informasjonskilder");
  expect(heading).toBeDefined();
  expect(await heading.textContent()).toEqual("Medier og informasjonskilder");
  const div = page.getByText("Ressursen er hentet fra NDLA");
  expect(await div.isVisible()).toBeTruthy();
});
