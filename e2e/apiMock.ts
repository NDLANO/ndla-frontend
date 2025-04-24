/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test as Ptest } from "@playwright/test";
import { API_REGEX, createCheckpoint, getMockdataFilename, removeSensitiveDataFromHar } from "./utils";

interface ExtendedTestOptions {
  harCheckpoint: () => Promise<void>;
  waitGraphql: () => Promise<void>;
}

/**
 * Extending the playwright test object with a checkpoint function.
 * The checkpoint function helps us differentiate between subsequent
 * requests, and allows us to more easily mock recurring calls.
 */
export const test = Ptest.extend<ExtendedTestOptions>({
  harCheckpoint: [
    async ({ context, page }, use) => {
      let checkpointIndex = 0;

      // Appending the checkpoint index to the request headers
      // Only appended for the stored headers in the HAR file
      await context.route(
        API_REGEX,
        async (route, request) =>
          await route.fallback({
            headers: {
              ...request.headers(),
              ...createCheckpoint(checkpointIndex),
            },
          }),
      );

      // Appending the checkpoint index to the request headers
      await page.setExtraHTTPHeaders(createCheckpoint(checkpointIndex));

      // Appending the new checkpoint index to the request headers
      await use(async () => {
        checkpointIndex += 1;
        await page.setExtraHTTPHeaders(createCheckpoint(checkpointIndex));
      });
    },
    { auto: true, scope: "test" },
  ],
  waitGraphql: async ({ page }, use) => {
    await use(async () => {
      if (process.env.RECORD_FIXTURES === "true") {
        await page.waitForResponse("**/graphql-api/graphql");
      }
    });
  },
  page: async ({ page }, use, testInfo) => {
    // Creating the API mocking for the wanted API's
    const mockdataFilename = getMockdataFilename(testInfo);
    await page.routeFromHAR(mockdataFilename, {
      update: process.env.RECORD_FIXTURES === "true",
      updateMode: "minimal",
      url: API_REGEX,
      updateContent: "embed",
    });

    await page.goto("/");
    await use(page);

    await page.close();
  },
  context: async ({ context }, use, testInfo) => {
    await use(context);
    await context.close();

    // Removing sensitive data from the HAR file after saving. Har files are saved on close.
    if (process.env.RECORD_FIXTURES === "true") {
      const mockdataFilename = getMockdataFilename(testInfo);
      await removeSensitiveDataFromHar(mockdataFilename);
    }
  },
});
