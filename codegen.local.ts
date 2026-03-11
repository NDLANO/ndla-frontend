/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/schema.graphql",
  documents: "./src/**/!(*.d).{ts,tsx}",
  generates: {
    "src/graphqlTypes.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
  config: {
    maybeValue: "T",
    typesPrefix: "GQL",
  },
};
export default config;
