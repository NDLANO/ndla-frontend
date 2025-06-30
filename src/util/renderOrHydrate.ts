/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { matchRoutes, RouteObject } from "react-router-dom";
import config from "../config";
import { createRoot, hydrateRoot } from "react-dom/client";

export const renderOrHydrate = async (container: Element | Document, children: ReactNode, routes: RouteObject[]) => {
  const lazyMatches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy);

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        if (m.route.lazy && typeof m.route.lazy === "function") {
          const routeModule = await m.route.lazy();
          Object.assign(m.route, { ...routeModule, lazy: undefined });
        }
      }),
    );
  }
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};
