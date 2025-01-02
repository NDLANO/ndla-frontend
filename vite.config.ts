/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig, splitVendorChunkPlugin } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
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
        babel: {
          configFile: "./babel.config.cjs",
        },
      }),
      splitVendorChunkPlugin(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG ?? "ndlano",
        project: process.env.SENTRY_PROJECT ?? "ndla-frontend",
        url: "https://sentry.io/",
        telemetry: false,
      }),
    ],
    ssr: {
      noExternal: ["@apollo/client"],
    },
    build: {
      target: "es2020",
      assetsDir: "static",
      outDir: "build/public",
      sourcemap: true,
      rollupOptions: {
        input: ["index.html", "lti.html", "iframe-article.html", "iframe-embed.html", "error.html"],
      },
    },
    resolve: {
      dedupe: ["react-router", "react-router-dom", "i18next", "react-i18next", "@ark-ui/react"],
    },
  };
});
