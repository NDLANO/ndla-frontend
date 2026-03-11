/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-check

import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const config = [
  {
    ignores: ["src/schema.graphql", "**/graphqlTypes.ts"],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx,mts,cts,mtsx,ctsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
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
      "@graphql-eslint/naming-convention": "off",
    },
  },
];

export default config;
