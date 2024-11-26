/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-check

import config from "eslint-config-ndla";
import tseslint from "typescript-eslint";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

export default tseslint.config(
  ...config,
  {
    ignores: ["**/graphqlTypes.ts", "**/schema.graphql"],
  },
  {
    files: ["**/*.graphql"],
    rules: {
      "header/header": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,mts,cts,mtsx,ctsx}"],
    processor: graphqlPlugin.processor,
  },
  {
    files: ["**/*.graphql"],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig: {
          schema: "./src/schema.graphql",
          documents: ["./src/**/*.{ts,tsx}"],
        },
      },
    },
    plugins: {
      "@graphql-eslint": graphqlPlugin,
    },
    rules: {
      ...graphqlPlugin.configs["flat/operations-recommended"].rules,
      ...graphqlPlugin.configs["flat/schema-recommended"].rules,
      // TODO: Consider enabling these later
      "@graphql-eslint/selection-set-depth": "off",
      "@graphql-eslint/require-selections": "off",
    },
  },
);
