/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import promBundle from "express-prom-bundle";
import { matchPath } from "react-router";
import { getLocaleInfoFromPath } from "../../i18n";
import { routes } from "../../routes";

export const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  excludeRoutes: ["/health"],
  normalizePath: (req) => {
    if (!req.route) return "unmatched";
    const routePaths: string[] = Array.isArray(req.route.path) ? req.route.path : [req.route.path];

    // The splat route renders the react app, so we label it with the
    // matching react-router route instead.
    if (!req.baseUrl && routePaths.includes("/*splat")) {
      const { basepath } = getLocaleInfoFromPath(req.path);
      const matched = routes.find((r) => matchPath(r, basepath));
      if (!matched) return "unmatched";
      return matched.startsWith("/") ? matched : `/${matched}`;
    }

    if (routePaths.length > 1) {
      const matched = routePaths.find((p) => matchPath(`${req.baseUrl}${p}`, req.path));
      if (matched) return `${req.baseUrl}${matched}`;
    }

    return `${req.baseUrl}${routePaths.join(",")}`;
  },
});
