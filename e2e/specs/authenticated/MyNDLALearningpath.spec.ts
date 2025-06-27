/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

const TEXT_STEP = "Tekst jeg har skrevet selv";
const ARTICLE_STEP = "Innhold fra NDLA";
const EXTERNAL_STEP = "Innhold fra et annet nettsted";
const FOLDER_STEP = "Innhold fra en av mine mapper i Min NDLA";
const UNSAVED_EDITS_WARNING = "Du har ulagrede endringer i steget. Om du fortsetter vil du miste endringene dine.";

test.beforeEach(async ({ page, waitGraphql }) => {
  await page.goto("/minndla/learningpaths?disableSSR=true");
  await waitGraphql();
});

test("can create learningpaths", async ({ page, harCheckpoint, waitGraphql }) => {
  await expect(page.locator("ol")).toBeVisible();
  const paths = await page.getByRole("main").getByRole("listitem").count();
  await page.getByRole("link", { name: "Ny", exact: true }).click();
  await page.getByRole("textbox").fill("TEST LÆRINGSSTI");
  await page.getByRole("button", { name: "Gå videre" }).click();
  await harCheckpoint();
  await waitGraphql();
  await page.getByTestId("my-ndla-menu").getByRole("link", { name: "Mine læringsstier" }).click();
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(paths + 1);
});

test("can edit learningpath title", async ({ page, harCheckpoint }) => {
  await harCheckpoint();
  const newTitle = Math.random().toString().substring(2, 8);
  await page.getByRole("main").getByRole("listitem").last().getByRole("link").click();
  await page.getByRole("link", { name: "Forrige", exact: true }).click();
  await page.getByRole("textbox").clear();
  await page.getByRole("textbox").fill(newTitle);
  await expect(page.getByRole("button", { name: "Gå videre", exact: true })).toBeEnabled();
});

test("can find all steps", async ({ page }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();

  const labels = page.locator("form").locator("label");

  await expect(labels.filter({ hasText: TEXT_STEP })).toBeVisible();
  await expect(labels.filter({ hasText: ARTICLE_STEP })).toBeVisible();
  await expect(labels.filter({ hasText: EXTERNAL_STEP })).toBeVisible();
  await expect(labels.filter({ hasText: FOLDER_STEP })).toBeVisible();
});

test("can create text step", async ({ page, waitGraphql, harCheckpoint }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");
  await expect(page.getByRole("heading", { name: "Legg til innhold" })).toBeInViewport();

  const textSteps = await page.getByRole("listitem").getByText(TEXT_STEP).count();
  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.getByRole("group");

  await groups.nth(1).getByRole("textbox", { name: "Tittel" }).fill("test");
  await groups.nth(2).getByRole("textbox", { name: "Ingress" }).fill("test");
  await groups.nth(3).getByRole("textbox", { name: "Innhold" }).fill("test");
  await page.getByRole("button", { name: "Lagre" }).click();
  await harCheckpoint();
  await waitGraphql();
  await expect(page.getByRole("listitem").getByText(TEXT_STEP)).toHaveCount(textSteps + 1);
});

test("can create article step", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");
  await expect(page.getByRole("heading", { name: "Legg til innhold" })).toBeInViewport();
  const amountArticleSteps = await page.getByRole("listitem").getByText(ARTICLE_STEP).count();

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").locator("label");
  await radiogroup.filter({ hasText: ARTICLE_STEP }).click();

  await groups.nth(1).locator("input").focus();
  await groups.nth(1).locator("input").fill("test");
  await page.keyboard.press("Enter");
  await waitGraphql();
  await page.waitForTimeout(1000);
  const selectedCombobox = page.locator('div[data-part="list"]').locator("div").first();
  const selectedComboboxTitle = await selectedCombobox.locator('div[data-part="item-text"]').textContent();

  await selectedCombobox.click();

  await page.getByRole("button", { name: "Lagre" }).click();
  await waitGraphql();
  const newStep = page
    .getByRole("listitem")
    .filter({ hasText: selectedComboboxTitle ?? "" })
    .last();
  await expect(newStep.getByText(ARTICLE_STEP)).toBeVisible();
  await expect(page.getByRole("listitem").getByText(ARTICLE_STEP)).toHaveCount(amountArticleSteps + 1);
});

test("can create external step", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");
  await expect(page.getByRole("heading", { name: "Legg til innhold" })).toBeInViewport();
  const externalSteps = await page.getByRole("listitem").getByText(EXTERNAL_STEP).count();

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(EXTERNAL_STEP).click();

  await groups.nth(3).getByRole("textbox").fill("https://ndla.no");

  await waitGraphql();
  const ndlaOpengraphTitle = "Nasjonal digital læringsarena - NDLA";

  await page.locator("label").filter({ hasText: "Innholdet jeg har lenket til" }).click();

  await page.getByRole("button", { name: "Lagre" }).click();
  await waitGraphql();
  const newStep = page.getByRole("listitem").filter({ hasText: ndlaOpengraphTitle }).last();
  await expect(newStep.getByText(EXTERNAL_STEP)).toBeVisible();
  await expect(page.getByRole("listitem").getByText(EXTERNAL_STEP)).toHaveCount(externalSteps + 1);
});

test("can create folder step", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");
  await expect(page.getByRole("heading", { name: "Legg til innhold" })).toBeInViewport();

  const amountArticleSteps = await page.getByRole("listitem").getByText(ARTICLE_STEP).count();
  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(FOLDER_STEP).click();

  await groups.nth(1).locator("input").focus();
  await page.keyboard.press("ArrowDown");
  const selectedCombobox = page.locator('div[data-part="item"]').first();
  const selectedComboboxTitle = await selectedCombobox.locator('div[data-part="item-text"]').textContent();
  await selectedCombobox.click();

  await page.getByRole("button", { name: "Lagre" }).click();
  await waitGraphql();
  const newStep = page
    .getByRole("listitem")
    .filter({ hasText: selectedComboboxTitle ?? "" })
    .last();
  await expect(newStep.getByText(ARTICLE_STEP)).toBeVisible();
  await expect(page.getByRole("listitem").getByText(ARTICLE_STEP)).toHaveCount(amountArticleSteps + 1);
});

test("shows warning dialog when closing form and text form is dirty", async ({ page }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");

  const title = Math.random().toString().substring(2, 8);

  await groups.nth(1).locator("input").fill(title);

  await page.getByRole("link", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when closing form and article form is dirty", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").locator("label");
  await radiogroup.filter({ hasText: ARTICLE_STEP }).click();

  await groups.nth(1).locator("input").focus();
  await groups.nth(1).locator("input").fill("test");
  await page.keyboard.press("Enter");
  await waitGraphql();
  await page.waitForTimeout(1000);
  await page.locator('div[data-part="list"]').locator("div").first().click();
  await page.getByRole("link", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when closing form and external form is dirty", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(EXTERNAL_STEP).click();

  await groups.nth(3).getByRole("textbox").fill("https://ndla.no");

  await waitGraphql();
  await page.locator("label").filter({ hasText: "Innholdet jeg har lenket til" }).click();
  await page.getByRole("link", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when closing form and folder form is dirty", async ({ page }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(FOLDER_STEP).click();

  await groups.nth(1).locator("input").focus();
  await page.keyboard.press("ArrowDown");
  const item = page.locator('div[data-part="item"]').first();
  const title = await item.locator("div").locator("div").textContent();
  await item.click();
  await expect(page.getByRole("link", { name: title ?? "" })).toBeVisible();
  await page.getByRole("link", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when navigating and text form is dirty", async ({ page }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.getByRole("group");

  const title = Math.random().toString().substring(2, 8);

  await groups.nth(1).getByRole("textbox", { name: "Tittel" }).fill(title);
  await page.getByRole("navigation").getByRole("listitem").getByRole("link").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when navigating and article form is dirty", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").locator("label");
  await radiogroup.filter({ hasText: ARTICLE_STEP }).click();

  await groups.nth(1).locator("input").focus();
  await groups.nth(1).locator("input").fill("test");
  await page.keyboard.press("Enter");
  await waitGraphql();
  await page.waitForTimeout(1000);
  await page.locator('div[data-part="list"]').locator("div").first().click();
  await page.getByRole("navigation").getByRole("listitem").getByRole("link").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when navigating and external form is dirty", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(EXTERNAL_STEP).click();

  await groups.nth(3).getByRole("textbox").fill("https://ndla.no");

  await waitGraphql();
  await page.locator("label").filter({ hasText: "Innholdet jeg har lenket til" }).click();
  await page.getByRole("navigation").getByRole("listitem").getByRole("link").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("shows warning dialog when navigating and folder form is dirty", async ({ page }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();
  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Legg til steg" }).click();
  const groups = page.locator("form").getByRole("group");
  const radiogroup = page.locator("form").getByRole("radiogroup");
  await radiogroup.getByText(FOLDER_STEP).click();

  await groups.nth(1).locator("input").focus();
  await page.keyboard.press("ArrowDown");
  const item = page.locator('div[data-part="item"]').first();
  const title = await item.locator("div").locator("div").textContent();
  await item.click();
  await expect(page.getByRole("link", { name: title ?? "" })).toBeVisible();

  await page.getByRole("navigation").getByRole("listitem").getByRole("link").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("paragraph")).toHaveText(UNSAVED_EDITS_WARNING);
});

test("can preview learningpath", async ({ page, waitGraphql }) => {
  const learningpath = page.getByRole("main").getByRole("listitem").last().getByRole("link");
  const learningpathTitle = await learningpath.textContent();
  await learningpath.click();

  await expect(page.getByRole("heading")).toHaveText(learningpathTitle ?? "");

  await page.getByRole("link", { name: "Gå videre" }).click();
  await waitGraphql();

  await expect(page.getByRole("heading", { name: "Se gjennom" })).toBeVisible();

  await expect(page.getByLabel("Gå til neste steg")).toBeVisible();
});

test("can share learningpath", async ({ page, waitGraphql }) => {
  await expect(page.locator("ol")).toBeVisible();
  const sharedPaths = await page.getByRole("main").locator("li").filter({ hasText: "Delt" }).count();
  await page
    .getByRole("main")
    .locator("li")
    .filter({ hasText: /Påbegynt|(Klar for deling)/ })
    .getByLabel("Vis redigeringsmuligheter")
    .last()
    .click();
  await page.getByRole("menuitem", { name: "Del" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Ferdig" }).click();
  await waitGraphql();
  await expect(page.getByRole("main").locator("li").filter({ hasText: "Delt" })).toHaveCount(sharedPaths + 1);
});

test("can copy learningpath link", async ({ page }) => {
  await expect(page.locator("ol")).toBeVisible();
  const listItem = page
    .locator("li")
    .filter({ has: page.getByText("Delt") })
    .first();
  await listItem.getByLabel("Vis redigeringsmuligheter").last().click();
  await page.getByRole("menuitem", { name: "Kopier lenke" }).click();

  const url: string = await page.evaluate("navigator.clipboard.readText()");
  expect(url).toBeDefined();
  expect(url.includes("ndla.no/nb/learningpaths/")).toBeTruthy();
});

test("can go to learningpath", async ({ page }) => {
  await expect(page.locator("ol")).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .locator("li")
      .filter({ hasText: /Påbegynt|(Klar for deling)|Delt/ })
      .first(),
  ).toBeVisible();
  const listItem = page
    .locator("li")
    .filter({ has: page.getByText("Delt") })
    .first();
  await listItem.getByLabel("Vis redigeringsmuligheter").last().click();
  await expect(page.getByRole("menuitem", { name: "Gå til" })).toBeVisible();
});

test("can unshare learningpath", async ({ page, waitGraphql }) => {
  await expect(page.locator("ol")).toBeVisible();

  const sharedPaths = await page.getByRole("main").locator("li").filter({ hasText: /Delt/ }).count();
  await page
    .getByRole("main")
    .locator("li")
    .filter({ hasText: /Delt/ })
    .last()
    .getByLabel("Vis redigeringsmuligheter")
    .last()
    .click();
  await page.getByRole("menuitem", { name: "Avslutt deling" }).click();
  await waitGraphql();
  await expect(page.getByRole("main").locator("li").filter({ hasText: /Delt/ })).toHaveCount(sharedPaths - 1);
});

test("can delete learningpath", async ({ page, waitGraphql, harCheckpoint }) => {
  await harCheckpoint();
  await expect(page.locator("ol")).toBeVisible();
  const paths = await page.getByRole("main").getByRole("listitem").count();
  const listItems = page.getByRole("main").locator("li");
  const listItem = listItems.first();
  await listItem.getByLabel("Vis redigeringsmuligheter").last().click();
  await page.getByRole("menuitem", { name: "Slett" }).click();
  await harCheckpoint();
  await page.getByRole("dialog").getByRole("button", { name: "Slett læringssti" }).click();
  await waitGraphql();
  await harCheckpoint();

  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(paths - 1);
});
