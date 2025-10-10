/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObjectWithImportPath } from "../interfaces";
import { ErrorElement } from "../RouteErrorElement";

export const iframeArticleRoutes: RouteObjectWithImportPath[] = [
  {
    path: "/article-iframe",
    errorElement: <ErrorElement />,
    children: [
      {
        path: ":lang?/article/:articleId",
        importPath: "src/iframe/IframePageContainer.tsx",
        lazy: () => import("./IframePageContainer"),
      },
      {
        path: ":lang?/:taxonomyId/:articleId",
        importPath: "src/iframe/IframePageContainer.tsx",
        lazy: () => import("./IframePageContainer"),
      },
    ],
  },
];
