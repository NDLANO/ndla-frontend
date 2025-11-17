/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "esnext",
  ignoreAnnotations: true,
  sourcemap: true,
  sourcesContent: false,
  external: ["vite"],
  outfile: "build/server.js",
  // Vite automatically handles SSR env variables, covering most of our application.
  // However, we also need to define it here to cover the small portion of our backend that runs outside of Vite.
  define: {
    __IS_CLIENT__: "false",
    __IS_PRODUCTION__: "true",
    "import.meta.env.SSR": "true",
  },
  // Mixing ESM and CJS is still a struggle. This is a workaround for now.
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
});
