/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router";
import { ErrorElement } from "../RouteErrorElement";

export const iframeEmbedRoutes: RouteObject[] = [
  {
    path: "/embed-iframe/:lang?/:embedType/:embedId",
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        lazy: () => import("./EmbedIframePageContainer"),
      },
    ],
  },
];
