/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router";
import { PageErrorBoundary } from "../containers/ErrorPage/ErrorBoundary";

const ErrorBoundaryLayout = () => (
  <PageErrorBoundary>
    <Outlet />
  </PageErrorBoundary>
);

// Intercepts links to e.g., related articles and opens them in a new tab, in order to open them in the normal entrypoint
const ArticleLinkInterceptor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.open(location.pathname, "_blank");
    navigate(-1);
  });

  return null;
};

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
        Component: ArticleLinkInterceptor,
      },
    ],
  },
];
