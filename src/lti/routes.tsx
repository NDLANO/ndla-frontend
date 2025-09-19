/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        lazy: () => import("./LtiProvider"),
      },
      {
        path: "article-iframe",
        children: [
          {
            path: ":lang?/article/:articleId",
            lazy: () => import("./LtiIframePage"),
          },
          {
            path: ":lang?/:taxonomyId/:articleId",
            lazy: () => import("./LtiIframePage"),
          },
        ],
      },
    ],
  },
];
