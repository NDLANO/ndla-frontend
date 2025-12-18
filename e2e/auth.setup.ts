/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

test("authenticate", async ({ page }) => {
  if (process.env.RECORD_FIXTURES === "true") {
    await page.goto("/login?returnTo=/minndla");
    await page.getByRole("link").getByText("Feide test users").click();
    await page.getByLabel("Username").fill(process.env.FEIDE_TEACHER_USER_NAME ?? "");
    await page.getByLabel("Password", { exact: true }).fill(process.env.FEIDE_TEACHER_USER_PASSWORD ?? "");
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  } else {
    const expAt = (32518706430 - 1687564890 - 60) * 1000 + new Date().getTime();

    await page.context().addCookies([
      {
        name: "ndla_session_expires_at",
        value: expAt.toString(),
        expires: 2147483647,
        path: "/",
        domain: "localhost",
      },
    ]);
  }
  await page.context().storageState({ path: STORAGE_STATE });
});
