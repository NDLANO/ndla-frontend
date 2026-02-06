/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test.beforeEach(async ({ page, waitGraphql }) => {
  await page.goto("/minndla/folders?disableSSR=true");
  await waitGraphql();
  const pageHeading = page.getByRole("heading", { name: "Mine mapper", exact: true });
  await expect(pageHeading).toBeVisible();
});

test("can copy sharable link to folder", async ({ page }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  const folderCount = await folderList.getByRole("listitem").count();
  expect(folderCount).toBeGreaterThanOrEqual(1);

  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByRole("img", { name: "Delt mappe" }) })
    .first();

  const sharedFolderTitle = await sharedFolder.getByRole("link").textContent();
  await expect(sharedFolder).toBeVisible();

  await sharedFolder.getByRole("button").last().click();
  await page.getByRole("menuitem", { name: "Kopier lenke", exact: true }).click();

  const url: string = await page.evaluate("navigator.clipboard.readText()");
  expect(url).toBeDefined();

  await sharedFolder.getByRole("button").last().click();
  await page.getByRole("menuitem", { name: "Gå til delt mappe", exact: true }).click();

  const heading = page.getByRole("heading").first();
  await expect(heading.first()).toHaveText(sharedFolderTitle ?? "");
});

test("can add and delete folder", async ({ page, harCheckpoint, waitGraphql }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  const count = await folderList.getByRole("listitem").count();
  expect(count).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Ny", exact: true }).click();
  await page.getByLabel("Navn").click();
  const name = "Vår sterke test mappeeec";
  await page.keyboard.type(name);

  await harCheckpoint();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await waitGraphql();

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goBack();
  await expect(folderList.getByRole("listitem")).toHaveCount(count + 1);
  const newFolder = folderList.getByRole("listitem").filter({ has: page.getByRole("link", { name, exact: true }) });
  await expect(newFolder).toBeVisible();
  await newFolder.getByRole("button").click();
  await newFolder.getByRole("menuitem", { name: "Slett" }).click();
  await harCheckpoint();
  await page.getByRole("dialog").getByRole("button", { name: "Slett mappe" }).click();
  await harCheckpoint();
  await waitGraphql();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("listitem", { name })).not.toBeVisible();
  await expect(folderList.getByRole("listitem")).toHaveCount(count);
});

test("can copy own folder", async ({ page }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  const count = await folderList.getByRole("listitem").count();
  expect(count).toBeGreaterThanOrEqual(1);

  const folder = folderList.getByRole("listitem").first();

  await expect(folder).toBeVisible();

  const folderName = await folder.getByRole("link").textContent();

  await folder.getByRole("button").last().click();
  await page.getByRole("menuitem", { name: "Kopier mappe", exact: true }).click();

  await expect(page.getByRole("heading", { name: `${folderName}_Kopi`, exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Slett", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Slett mappe" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("can share and unshare folder", async ({ page }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  const count = await folderList.getByRole("listitem").count();
  expect(count).toBeGreaterThanOrEqual(1);

  const unSharedFolder = folderList
    .getByRole("listitem")
    .filter({ hasNot: page.getByRole("img", { name: "Delt mappe" }) })
    .first();

  const sharedFolderTitle = (await unSharedFolder.getByRole("link").textContent()) ?? "";
  expect(sharedFolderTitle.length).toBeGreaterThanOrEqual(1);

  await unSharedFolder.getByRole("button").click();
  await page.getByRole("menuitem", { name: "Del", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Ferdig" }).click();
  const folderAfterShare = folderList
    .getByRole("listitem")
    .filter({ has: page.getByRole("link", { name: sharedFolderTitle, exact: true }) })
    .filter({ has: page.getByRole("img", { name: "Delt mappe" }) });
  await expect(folderAfterShare.getByRole("link", { name: sharedFolderTitle, exact: true })).toBeVisible();
  await folderAfterShare.getByRole("button").click();

  await page.getByRole("menuitem", { name: "Avslutt deling", exact: true }).click();

  const folderAfterUnshare = folderList.getByRole("listitem").filter({
    hasNot: page.getByRole("img", { name: "Delt mappe" }),
    has: page.getByRole("link", { name: sharedFolderTitle, exact: true }),
  });
  await expect(folderAfterUnshare).toBeVisible();
});

test("can go to shared folder page", async ({ page }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(1);

  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByRole("img", { name: "Delt mappe" }) })
    .first();

  const sharedFolderTitle = (await sharedFolder.getByRole("link").textContent()) ?? "";
  await sharedFolder.getByRole("button").last().click();
  await page.getByRole("menuitem", { name: "Gå til delt mappe", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: sharedFolderTitle, exact: true })).toBeVisible();
});

test("can edit folder name on list item ", async ({ page, harCheckpoint }) => {
  const folderList = page.getByRole("list", { name: "Mapper", exact: true });
  await expect(folderList).toBeVisible();
  await folderList.getByRole("listitem").first().getByRole("button").click();

  await harCheckpoint();
  await page.getByRole("menuitem", { name: "Rediger" }).click();
  await page.getByLabel("Navn").click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type(Math.random().toString(36).substring(2, 25));
});
