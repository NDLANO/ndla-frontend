/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TestInfo } from "@playwright/test";
import { readFile, writeFile } from "fs/promises";

const MOCK_DIR = "e2e/apiMocks/";
const TEST_IMAGE_REGEX = "https://api.test.ndla.no/(?!image-api/raw.*).*";
const LOCALHOST_GRAPHQL_REGEX = "http://localhost:4000/graphql-api/graphql";

export const API_REGEX = new RegExp(`^(${TEST_IMAGE_REGEX}|${LOCALHOST_GRAPHQL_REGEX})$`);

export const removeSensitiveDataFromHar = async (fileName: string) => {
  const data = JSON.parse(await readFile(fileName, "utf8"));
  await writeFile(fileName, JSON.stringify(data), "utf8");
};

export const getMockdataFilename = ({ titlePath, title: test_name }: TestInfo) => {
  const [, SPEC_GROUP, SPEC_NAME] = titlePath[0].split("/");
  return `${MOCK_DIR}${SPEC_GROUP}_${SPEC_NAME}_${test_name.replace(/\s/g, "_")}.har`;
};

export const createCheckpoint = (index: number) => ({ "x-playwright-checkpoint": `${index}` });
