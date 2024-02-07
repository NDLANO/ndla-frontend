/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { test, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

test("authenticate", async ({ page }) => {
  if (process.env.RECORD_FIXTURES === "true") {
    await page.goto("/login?state=/minndla");
    await page.getByRole("link").getByText("Feide test users").click();
    await page.getByLabel("Username").fill(process.env.FEIDE_TEACHER_USER_NAME ?? "");
    await page.getByLabel("Password", { exact: true }).fill(process.env.FEIDE_TEACHER_USER_PASSWORD ?? "");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  } else {
    const expAt = (32518706430 - 1687564890 - 60) * 1000 + new Date().getTime();
    const test = {
      ndla_expires_at: expAt,
    };

    await page.context().addCookies([
      {
        name: "feide_auth",
        value: JSON.stringify(test),
        expires: 2147483647,
        path: "/",
        domain: "localhost",
      },
    ]);
  }
  await page.context().storageState({ path: STORAGE_STATE });
});
