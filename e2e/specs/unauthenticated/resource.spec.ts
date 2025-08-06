/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/r/yrkesfaglig-fordypning-hs-hsf-vg1/arsplan-helse--og-oppvekstfag/53a49f710c?disableSSR=true");
});

test("contains content", async ({ page, waitGraphql }) => {
  await waitGraphql();
  await expect(page.getByLabel("Brødsmulesti").getByRole("listitem")).toHaveCount(4);
  await expect(page.getByLabel("Brødsmulesti").getByRole("listitem").getByRole("link")).toHaveCount(3);

  const heading = page.getByRole("heading").getByText("Årsplan helse- og oppvekstfag");
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();

  const rules = page.getByRole("button").getByText("Sitere eller gjenbruke?");
  expect(rules).toBeDefined();
  await expect(rules).toBeVisible();
});
