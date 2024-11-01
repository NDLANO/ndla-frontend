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
  await page.goto("/minndla/folders", { waitUntil: "domcontentloaded" });
});

test("can copy sharable link to folder", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByLabel("Delt Mappe", { exact: true }) })
    .nth(1);

  const sharedFolderTitle = (await sharedFolder.getByRole("link").textContent()) ?? "";
  await expect(sharedFolder).toBeVisible();

  await sharedFolder.getByLabel("Vis redigeringsmuligheter").click();
  await page.getByRole("menuitem", { name: "Kopier lenke", exact: true }).click();

  const url: string = await page.evaluate("navigator.clipboard.readText()");
  expect(url).toBeDefined();

  await page.goto(url);

  const heading = page.getByRole("main").getByRole("heading").first();
  await expect(heading).toHaveText(sharedFolderTitle);
});

test("can add and delete folder", async ({ page, harCheckpoint }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  const count = await folderList.getByRole("listitem").count();
  expect(count).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Ny", exact: true }).click();
  await page.getByLabel("Navn").click();
  const name = "Vår sterke test mappeeec";
  await page.keyboard.type(name);

  await harCheckpoint();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goBack();
  await expect(folderList.getByRole("listitem")).toHaveCount(count + 1);
  await page.getByRole("listitem").filter({ hasText: name }).getByLabel("Vis redigeringsmuligheter").click();
  await page.getByRole("menuitem", { name: "Slett" }).click();
  await harCheckpoint();
  await page.getByRole("dialog").getByRole("button", { name: "Slett mappe" }).click();
  await harCheckpoint();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("listitem").getByText(name).last()).not.toBeVisible();
  await expect(folderList.getByRole("listitem")).toHaveCount(count);
});

test("can drag and drop folders", async ({ page, harCheckpoint }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const initialFolderOrder = await folderList.getByRole("listitem").getByRole("link").allTextContents();
  const firstItem = folderList.getByRole("listitem").first().getByRole("button").first();
  const secondItem = folderList.getByRole("listitem").nth(1).getByRole("button").first();

  await secondItem.hover();
  await page.mouse.down();

  await firstItem.hover();
  await page.mouse.up();
  await harCheckpoint();

  const newFolderOrder = await folderList.getByRole("listitem").getByRole("link").allTextContents();

  expect(initialFolderOrder).not.toStrictEqual(newFolderOrder);

  await secondItem.hover();
  await page.mouse.down();
  await firstItem.hover();
  await page.mouse.up();
  await harCheckpoint();

  const oldFolderOrder = await folderList.getByRole("listitem").getByRole("link").allTextContents();
  expect(initialFolderOrder).toStrictEqual(oldFolderOrder);
});

test("can share and unshare folder", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const unSharedFolder = folderList
    .getByRole("listitem")
    .filter({ hasNot: page.getByLabel("Delt mappe") })
    .first();
  const sharedFolderTitle = (await unSharedFolder.getByRole("link").textContent()) ?? "";
  expect(unSharedFolder).toBeVisible();

  await unSharedFolder.getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Del", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Ferdig" }).click();
  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        has: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("link")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);

  await page
    .getByRole("listitem")
    .filter({
      hasText: sharedFolderTitle,
    })
    .getByRole("button")
    .nth(1)
    .click();

  await page.getByRole("menuitem", { name: "Avslutt deling", exact: true }).click();

  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        hasNot: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("link")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);
});

test("can go to shared folder page", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);
  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByLabel("Delt Mappe", { exact: true }) })
    .nth(1);

  const sharedFolderTitle = (await sharedFolder.getByRole("link").textContent()) ?? "";
  expect(sharedFolder).toBeDefined();

  await sharedFolder.getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Gå til delt mappe", exact: true }).click();

  await page.waitForURL("/folder/*");

  await expect(page.getByRole("main").getByRole("heading")).toHaveText(sharedFolderTitle);
});

test("can edit folder name on list item ", async ({ page, harCheckpoint }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();

  const folderList = page.getByRole("main").getByRole("list").first();
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(1);
  await folderList.first().getByRole("button").nth(1).click();

  await harCheckpoint();
  await page.getByRole("menuitem", { name: "Rediger" }).click();
  await page.getByLabel("Navn").click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type([...Array(5)].map(() => Math.random().toString(36)[2]).join(""));
});
