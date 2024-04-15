/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readFile, writeFile } from "fs/promises";
import { Page, test as Ptest, TestInfo } from "@playwright/test";

const mockDir = "e2e/apiMocks/";

const apiTestRegex = "https://api.test.ndla.no/(?!image-api/raw.*).*";

interface ExtendParams {
  harCheckpoint: () => Promise<void>;
}
const regex = new RegExp(`^(${apiTestRegex})$`);

const mockFile = ({ titlePath, title: test_name }: TestInfo) => {
  const [_dir, SPEC_GROUP, SPEC_NAME] = titlePath[0].split("/");
  return `${mockDir}${SPEC_GROUP}_${SPEC_NAME}_${test_name.replace(/\s/g, "_")}.har`;
};

/**
 * Extending the playwright test object with a checkpoint function.
 * The checkpoint function helps us differentiate between subsequent
 * requests, and allows us to more easily mock recurring calls.
 */
export const test = Ptest.extend<ExtendParams>({
  harCheckpoint: [
    async ({ context, page }, use) => {
      let checkpointIndex = 0;

      // Appending the checkpoint index to the request headers
      // Only appended for the stored headers in the HAR file
      await context.route(
        regex,
        async (route, request) =>
          await route.fallback({
            headers: {
              ...request.headers(),
              "X-Playwright-Checkpoint": `${checkpointIndex}`,
            },
          }),
      );

      // Appending the checkpoint index to the request headers
      if (process.env.RECORD_FIXTURES === "true") {
        await page.setExtraHTTPHeaders({
          "X-Playwright-Checkpoint": `${checkpointIndex}`,
        });
      }

      // Appending the new checkpoint index to the request headers
      await use(async () => {
        checkpointIndex += 1;
        process.env.RECORD_FIXTURES !== "true" &&
          (await page.setExtraHTTPHeaders({
            "X-Playwright-Checkpoint": `${checkpointIndex}`,
          }));
      });
    },
    { auto: true, scope: "test" },
  ],
  page: async ({ page }, use, testInfo) => {
    // Creating the API mocking for the wanted API's
    await page.routeFromHAR(mockFile(testInfo), {
      update: process.env.RECORD_FIXTURES === "true",
      updateMode: "minimal",
      url: regex,
      updateContent: "embed",
    });

    await use(page);

    await page.close();
  },
  context: async ({ context }, use, testInfo) => {
    await use(context);
    await context.close();

    // Removing sensitive data from the HAR file after saving. Har files are saved on close.
    if (process.env.RECORD_FIXTURES === "true") {
      await removeSensitiveData(mockFile(testInfo));
    }
  },
});

export const mockWaitResponse = async (page: Page, url: string) => {
  if (process.env.RECORD_FIXTURES === "true") {
    await page.waitForResponse(url);
  }
};

// Method to remove sensitive data from the HAR file
// Currently only working to write har file as a single line
const removeSensitiveData = async (fileName: string) => {
  const data = JSON.parse(await readFile(fileName, "utf8"));
  await writeFile(fileName, JSON.stringify(data), "utf8");
};
