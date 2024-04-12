/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from "@pandacss/dev";
import { preset } from "@ndla/primitives";

export default defineConfig({
  presets: [preset],
  // Whether to use css reset
  preflight: false,
  // minify: true,

  // Where to look for your css declarations

  include: ["./node_modules/@ndla/*/dist/panda.buildinfo.json", "./src/**/*.{js,jsx,ts,tsx}"],
  importMap: "@ndla/styled-system",

  // Files to exclude
  exclude: [],
  jsxStyleProps: "minimal",
  jsxFramework: "react",
  syntax: "object-literal",

  // The output directory for your css system
  outdir: "styled-system",
});
