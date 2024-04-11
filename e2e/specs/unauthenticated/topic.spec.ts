/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test, mockWaitResponse } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/?disableSSR=true");
});

test("contains article header and introduction", async ({ page }) => {
  await mockWaitResponse(page, "**/graphql-api/*");
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Fag", exact: true }).click();
  await mockWaitResponse(page, "**/graphql-api/*");
  await page.getByText("ALLE FAG").last().click();
  await page.getByRole("link", { name: "Medieuttrykk 3" }).last().click();
  await mockWaitResponse(page, "**/graphql-api/*");
  await page
    .getByTestId("nav-box-list")
    .getByRole("listitem")
    .getByRole("link", { name: "Idéskaping og mediedesign" })
    .click();
  await mockWaitResponse(page, "**/graphql-api/*");
  expect(page.getByRole("heading", { name: "Idéskaping og mediedesign" })).toBeDefined();
});

test("show have functioning language box", async ({ page }) => {
  await mockWaitResponse(page, "**/graphql-api/*");
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Fag", exact: true }).click();
  await page.getByText("ALLE FAG").last().click();
  await page.getByRole("link", { name: "Medieuttrykk 3" }).last().click();
  await page
    .getByTestId("nav-box-list")
    .getByRole("listitem")
    .getByRole("link", { name: "Tverrfaglige medieoppdrag" })
    .click();

  await mockWaitResponse(page, "**/graphql-api/*");

  expect(page.getByRole("heading", { name: "Tverrfaglige medieoppdrag" })).toBeDefined();
  expect(page.getByRole("button", { name: "Vis hele emnebeskrivelsen" })).toBeDefined();
});
