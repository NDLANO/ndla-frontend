/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    test: {
      include: ["src/**/__tests__/*-test.(js|jsx|ts|tsx)"],
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/__tests__/vitest.setup.ts",
    },
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          configFile: "./babel.config.cjs",
        },
      }),
      splitVendorChunkPlugin(),
    ],
    ssr: {
      noExternal: ["@apollo/client"],
    },
    build: {
      target: "es2022",
      assetsDir: "static",
      outDir: "build/public",
      sourcemap: true,
      rollupOptions: {
        input: ["index.html", "lti.html", "iframe-article.html", "iframe-embed.html", "error.html"],
      },
    },
    resolve: {
      preserveSymlinks: true,
    },
  };
});