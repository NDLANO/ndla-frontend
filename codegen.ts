/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GQL_SCHEMA === "server" ? "http://localhost:4000/graphql-api/graphql" : "src/schema.graphql",
  documents: "./src/**/!(*.d).{ts,tsx}",
  generates: {
    "src/graphqlTypes.ts": {
      plugins: ["typescript-operations"],
      config: {
        typesPrefix: "GQL",
        // Apollo recommends these
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
    },
    "src/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
