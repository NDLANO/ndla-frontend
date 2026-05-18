/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { build } from "rolldown";

await build({
  input: "src/server.ts",
  platform: "node",
  external: ["vite"],
  output: {
    file: "build/server.js",
    format: "esm",
    codeSplitting: false,
    sourcemap: true,
  },
});
