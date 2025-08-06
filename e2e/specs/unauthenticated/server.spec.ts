/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test("That invalid urls return status 400", async ({ page }) => {
  const invalidUrls = [
    "/%c0",
    "/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/etc/passwd",
    "/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/windows/win.ini",
    "/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/etc/passwd",
    "/%c0%ae%c0%ae/%c0%ae%c0%ae/%c0%ae%c0%ae/windows/win.ini",
    "/%c0%ae/%c0%ae/%c0%ae/%c0%ae/WEB-INF/web.xml",
    "/%c0%ae/%c0%ae/%c0%ae/WEB-INF/web.xml",
    "/%c0%ae/%c0%ae/WEB-INF/web.xml",
    "/%c0%ae/WEB-INF/web.xml",
  ];

  for (const url of invalidUrls) {
    const response = await page.request.get(url, { failOnStatusCode: false });
    expect(response).toBeDefined();
    expect(response!.status()).toBe(400);
  }
});

test("That server doesn't crash when throwing an error", async ({ page }) => {
  const res = await page.request.get("/logout", { failOnStatusCode: false });
  expect(res.status()).toBe(400);

  const res2 = await page.request.get("/logout", { failOnStatusCode: false });
  expect(res2.status()).toBe(400);
});
