/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router-dom";
import { ErrorElement } from "../RouteErrorElement";

export const iframeArticleRoutes: RouteObject[] = [
  {
    path: "/article-iframe",
    errorElement: <ErrorElement />,
    children: [
      {
        path: ":lang?/article/:articleId",
        lazy: () => import("./IframePageContainer"),
      },
      {
        path: ":lang?/:taxonomyId/:articleId",
        lazy: () => import("./IframePageContainer"),
      },
    ],
  },
];
