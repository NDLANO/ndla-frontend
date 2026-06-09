/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect, Page } from "@playwright/test";
import { test } from "../../apiMock";

const injectBuildId = async (page: Page, buildId: string) => {
  await page.addInitScript((id: string) => {
    Object.defineProperty(window, "DATA", {
      configurable: true,
      set(value: any) {
        value.config.componentVersion = id;
        Object.defineProperty(window, "DATA", { value, writable: true, configurable: true });
      },
    });
  }, buildId);
};

// Dispatch visibilitychange as if the user returns to the tab, then wait for
// the resulting /build-id fetch. Use a glob so the full URL is matched.
const triggerBuildIdCheck = async (page: Page) => {
  const response = page.waitForResponse("**/build-id");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await response;
};

test("/build-id endpoint returns a build ID", async ({ request }) => {
  const res = await request.get("/build-id");
  expect(res.ok()).toBe(true);
  const { buildId } = await res.json();
  expect(typeof buildId).toBe("string");
});

test.describe("skew detection", () => {
  test.beforeEach(async ({ page, waitGraphql }) => {
    await injectBuildId(page, "e2e-build-v1");
    await page.goto("/?disableSSR=true");
    // This marker disappears on a full page load, survives a SPA navigation
    await page.evaluate(() => {
      (window as any).__skew_test_marker = true;
    });
    await waitGraphql();
  });

  test("performs a full-page navigation when the build ID changes", async ({ page, waitGraphql }) => {
    await page.route("**/build-id", (route) =>
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ buildId: "e2e-build-v2" }) }),
    );

    await triggerBuildIdCheck(page);

    await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();

    await waitGraphql();
    await expect(page.getByRole("heading", { name: "Medier og kommunikasjon" })).toBeVisible();
    const marker = await page.evaluate(() => (window as any).__skew_test_marker);
    expect(marker).toBeUndefined();
  });

  test("does not interfere with navigation when the build ID is current", async ({ page, waitGraphql }) => {
    await page.route("**/build-id", (route) =>
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ buildId: "e2e-build-v1" }) }),
    );

    await triggerBuildIdCheck(page);

    await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();

    const marker = await page.evaluate(() => (window as any).__skew_test_marker);
    expect(marker).toBe(true);
    await waitGraphql();
    await expect(page.getByRole("heading", { name: "Medier og kommunikasjon" })).toBeVisible();
  });

  test("reloads on a chunk load error", async ({ page, waitGraphql }) => {
    await page.route("**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}", (route) => route.fulfill({ status: 404 }));
    const reloadPromise = page.waitForRequest((req) => req.resourceType() === "document" && req.url() === page.url());
    await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
    await reloadPromise;
    await page.unroute("**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}");

    await page.waitForFunction(() => (window as any).__skew_test_marker === undefined);

    expect(await page.evaluate(() => (window as any).__skew_test_marker)).toBeUndefined();
    expect(await page.evaluate(() => sessionStorage.getItem("ndla_skew_reloaded"))).toBe("1");
    await waitGraphql();
    await expect(page.getByRole("heading", { name: "Medier og kommunikasjon" })).toBeVisible();
  });

  test("does not loop on a repeated chunk load error", async ({ page }) => {
    // Simulate that a reload already happened (guard was set by the first chunk failure)
    await page.evaluate(() => sessionStorage.setItem("ndla_skew_reloaded", "1"));
    await page.route(/ProgrammePage/, (route) => route.fulfill({ status: 404 }));
    await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
    await expect(page.getByRole("heading", { name: "Ops, noe gikk galt" })).toBeVisible();
  });
});
