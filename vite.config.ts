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
      assetsDir: "static",
      outDir: "build/public",
      sourcemap: true,
      rollupOptions: {
        input: ["index.html", "lti.html", "iframe-article.html", "iframe-embed.html", "error.html"],
      },
    },
    resolve: {
      dedupe: [
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-tooltip",
        "@radix-ui/react-accordion",
        "@radix-ui/react-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-switch",
        "react-router",
        "react-router-dom",
        "react-helmet-async",
        "i18next",
        "react-i18next",
        "@emotion/react",
        "@emotion/styled",
      ],
    },
  };
});
