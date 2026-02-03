/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import preset from "@ndla/preset-panda";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  presets: [preset],
  preflight: true,
  importMap: "@ndla/styled-system",
  strictPropertyValues: true,
  shorthands: false,
  outExtension: "js",
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@ndla/*/dist/panda.buildinfo.json"],
  syntax: "object-literal",
  jsxFramework: "react",
});
