/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild, mode }) => {
  const componentVersion = process.env.COMPONENT_VERSION ?? "SNAPSHOT";
  const isDevelopment = mode === "development";
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
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG ?? "ndlano",
        project: process.env.SENTRY_PROJECT ?? "ndla-frontend",
        release: {
          name: `ndla-frontend@${componentVersion}`,
        },
        url: "https://sentry.io/",
        telemetry: false,
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
          excludeTracing: true,
        },
      }),
    ],
    ssr: {
      noExternal: ["@apollo/client"],
    },
    build: {
      target: "es2020",
      assetsDir: "static",
      outDir: "build/public",
      cssCodeSplit: false,
      manifest: true,
      sourcemap: true,
      rollupOptions: {
        input: [
          "src/client.tsx",
          "src/lti/index.tsx",
          "src/iframe/index.tsx",
          "src/iframe/embedIframeIndex.tsx",
          "src/containers/ErrorPage/ErrorEntry.tsx",
        ],
      },
    },
    resolve: {
      dedupe: ["react-router", "i18next", "react-i18next", "@ark-ui/react", "react", "react-dom"],
      conditions: ["module-sync"],
    },
    define: {
      "globalThis.__DEV__": JSON.stringify(false),
      "config.isClient": JSON.stringify(!isSsrBuild),
      ...(isDevelopment ? {} : { __IS_SSR_BUILD__: JSON.stringify(isSsrBuild) }),
    },
  };
});
