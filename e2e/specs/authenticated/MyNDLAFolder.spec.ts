/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockGraphqlRoute, mockWaitResponse } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        fixture: "minndla_folder_data",
        names: ["myNdlaData", "foldersPage"],
      },
      {
        fixture: "minndla_folder_update",
        names: ["updateFolder"],
      },
      {
        fixture: "minndla_folder_updateStatus",
        names: ["updateFolderStatus"],
      },
      {
        fixture: "minndla_folder_notifications",
        names: ["arenaNotificationsV2"],
      },
      {
        fixture: "minndla_folder_sharedFolder",
        names: ["sharedFolder"],
      },
      {
        fixture: "minndla_folder_meta",
        names: ["folderResourceMetaSearch"],
      },
      {
        fixture: "minndla_folder_add",
        names: ["addFolder"],
      },
      {
        fixture: "minndla_folder_delete",
        names: ["deleteFolder"],
      },
      {
        fixture: "minndla_folder_recentlyUsed",
        names: ["recentlyUsed"],
      },
    ],
  });
  await page.goto("/minndla/folders");
});

test("change sort order of folders", async ({ page }) => {
  const buttons = page.getByTestId("list-view-options").getByRole("button");
  const svgs = await buttons.locator("svg").all();

  await expect(buttons).toHaveCount(3);
  await expect(svgs[0]).toHaveCSS("fill", "rgb(32, 88, 143)");
  await expect(page.getByRole("list").filter({ has: page.locator('[data-type="list"]') })).toHaveCount(1);

  await buttons.nth(1).click();
  await expect(svgs[1]).toHaveCSS("fill", "rgb(32, 88, 143)");
  await expect(page.getByRole("list").filter({ has: page.locator('[data-type="listLarger"]') })).toHaveCount(1);

  await buttons.nth(2).click();
  await expect(svgs[2]).toHaveCSS("fill", "rgb(32, 88, 143)");
  await expect(page.getByRole("list").filter({ has: page.locator('[data-type="block"]') })).toHaveCount(1);

  await buttons.nth(0).click();
  await expect(svgs[0]).toHaveCSS("fill", "rgb(32, 88, 143)");
  await expect(page.getByRole("list").filter({ has: page.locator('[data-type="list"]') })).toHaveCount(1);
});

test("can drag and drop folders", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const initialFolderOrder = await folderList.getByRole("listitem").getByRole("heading").allTextContents();
  const firstItem = folderList.getByRole("listitem").first().getByRole("button").first();
  const secondItem = folderList.getByRole("listitem").nth(1).getByRole("button").first();

  await secondItem.hover();
  await page.mouse.down();
  await firstItem.hover();
  await page.mouse.up();

  const newFolderOrder = await folderList.getByRole("listitem").getByRole("heading").allTextContents();

  expect(initialFolderOrder).not.toStrictEqual(newFolderOrder);

  await secondItem.hover();
  await page.mouse.down();
  await firstItem.hover();
  await page.mouse.up();

  const oldFolderOrder = await folderList.getByRole("listitem").getByRole("heading").allTextContents();

  expect(initialFolderOrder).toStrictEqual(oldFolderOrder);
});

test("can edit folder name on list item ", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(1);

  const title = await folderList.getByRole("listitem").first().getByRole("heading").textContent();
  await folderList.first().getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Rediger" }).click();
  await page.getByLabel("Navn").click();

  await page.keyboard.press("Control+a");
  await page.keyboard.type([...Array(5)].map(() => Math.random().toString(36)[2]).join(""));
  await page.getByRole("dialog").getByRole("button", { name: "Lagre" }).click();

  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const newTitle = await folderList.getByRole("listitem").first().getByRole("heading").textContent();

  expect(title).not.toStrictEqual(newTitle);
});

test("can share and unshare folder", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const unSharedFolder = folderList
    .getByRole("listitem")
    .filter({ hasNot: page.getByLabel("Delt mappe") })
    .first();
  const sharedFolderTitle = (await unSharedFolder.getByRole("heading").textContent()) ?? "";
  expect(unSharedFolder).toBeDefined();

  await folderList.first().getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Del mappe", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Del mappe" }).click();
  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        has: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("heading")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);

  await folderList.first().getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Avslutt deling", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Avslutt deling" }).click();

  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        hasNot: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("heading")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);
});

test("can unshare folder from share modal", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const unSharedFolder = folderList
    .getByRole("listitem")
    .filter({ hasNot: page.getByLabel("Delt mappe") })
    .first();
  const sharedFolderTitle = (await unSharedFolder.getByRole("heading").textContent()) ?? "";
  expect(unSharedFolder).toBeDefined();

  await folderList.first().getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Del mappe", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Del mappe" }).click();
  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        has: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("heading")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);

  await folderList.first().getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Del", exact: true }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Avslutt deling" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Avslutt deling" }).click();

  expect(
    await folderList
      .getByRole("listitem")
      .filter({
        hasNot: page.getByLabel("Delt mappe"),
        hasText: sharedFolderTitle,
      })
      .getByRole("heading")
      .textContent(),
  ).toStrictEqual(sharedFolderTitle);
});

test("can copy sharable link to folder", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);

  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByLabel("Delt Mappe", { exact: true }) })
    .first();

  const sharedFolderTitle = (await sharedFolder.getByRole("heading").textContent()) ?? "";
  expect(sharedFolder).toBeDefined();

  await sharedFolder.getByLabel("Vis redigeringsmuligheter").click();
  await page.getByRole("menuitem", { name: "Kopier lenke til mappa", exact: true }).click();

  const url: string = await page.evaluate("navigator.clipboard.readText()");
  expect(url).toBeDefined();

  await page.goto(url);

  const heading = page.getByRole("main").getByRole("heading").first();
  await expect(heading).toHaveText(sharedFolderTitle);
});

test("can go to shared folder page", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThanOrEqual(2);
  const sharedFolder = folderList
    .getByRole("listitem")
    .filter({ has: page.getByLabel("Delt Mappe", { exact: true }) })
    .first();

  const sharedFolderTitle = (await sharedFolder.getByRole("heading").textContent()) ?? "";
  expect(sharedFolder).toBeDefined();

  await sharedFolder.getByRole("button").nth(1).click();
  await page.getByRole("menuitem", { name: "Gå til delt mappe", exact: true }).click();

  await page.waitForURL("/folder/*");

  await expect(page.getByRole("main").getByRole("heading")).toHaveText(sharedFolderTitle);
});

test("can add and delete folder", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeInViewport();
  const folderList = page.getByRole("list").filter({ has: page.locator('[data-type="list"]') });
  await expect(folderList).toBeInViewport();
  const count = await folderList.getByRole("listitem").count();
  expect(count).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Ny mappe" }).click();
  await page.getByLabel("Navn").click();
  const name = "Vår sterke test mappe";
  await page.keyboard.type(name);

  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await expect(page.getByRole("dialog")).not.toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toBeGreaterThan(count);
  await page.getByRole("listitem").filter({ hasText: name }).getByLabel("Vis redigeringsmuligheter").click();
  await page.getByRole("menuitem", { name: "Slett" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Slett mappe" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await expect(page.getByRole("dialog")).not.toBeInViewport();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await expect(page.getByRole("listitem").getByText(name).last()).toBeInViewport();
  expect(await folderList.getByRole("listitem").count()).toEqual(count);
});
