/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type EntryPointType = "default" | "lti" | "iframeArticle" | "iframeEmbed" | "error";

export const entryPoints: Record<EntryPointType, string> = {
  default: "src/client.tsx",
  lti: "src/lti/index.tsx",
  iframeArticle: "src/iframe/index.tsx",
  iframeEmbed: "src/iframe/embedIframeIndex.tsx",
  error: "src/containers/ErrorPage/ErrorEntry.tsx",
} as const;
