/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { baseConfig } from "@ndla/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true,
  },
  ignorePatterns: ["**/graphqlTypes.ts", "**/schema.graphql"],
  overrides: [
    {
      files: ["**/*.graphql"],
      rules: {
        "notice/notice": "off",
      },
    },
    {
      files: ["**/*"],
      rules: {
        "typescript/unbound-method": "off",
      },
    },
  ],
});
