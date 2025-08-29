/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObjectWithImportPath } from "../interfaces";
import { ErrorElement } from "../RouteErrorElement";

export const iframeEmbedRoutes: RouteObjectWithImportPath[] = [
  {
    path: "/embed-iframe/:lang?/:embedType/:embedId",
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        importPath: "src/iframe/EmbedIframePageContainer.tsx",
        lazy: () => import("./EmbedIframePageContainer"),
      },
    ],
  },
];
