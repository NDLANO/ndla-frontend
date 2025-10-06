/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Outlet, RouteObject } from "react-router";
import { PageErrorBoundary } from "../containers/ErrorPage/ErrorBoundary";

const ErrorBoundaryLayout = () => (
  <PageErrorBoundary>
    <Outlet />
  </PageErrorBoundary>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: ErrorBoundaryLayout,
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
      {
        path: "*",
        lazy: () => import("../containers/NotFoundPage/NotFoundPage"),
      },
    ],
  },
];
