/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObjectWithImportPath } from "../interfaces";

export const routes: RouteObjectWithImportPath[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        importPath: "src/lti/LtiProvider.tsx",
        lazy: () => import("./LtiProvider"),
      },
      {
        path: "article-iframe",
        children: [
          {
            path: ":lang?/article/:articleId",
            importPath: "src/lti/LtiIframePage.tsx",
            lazy: () => import("./LtiIframePage"),
          },
          {
            path: ":lang?/:taxonomyId/:articleId",
            importPath: "src/lti/LtiIframePage.tsx",
            lazy: () => import("./LtiIframePage"),
          },
        ],
      },
    ],
  },
];
