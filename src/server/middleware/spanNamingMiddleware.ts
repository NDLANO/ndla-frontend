/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { trace } from "@opentelemetry/api";
import { NextFunction, Request, Response } from "express";
import { matchPath } from "react-router";
import { getLocaleInfoFromPath } from "../../i18n";
import { routes } from "../../routes";

/** Name the active HTTP server span after the matched (locale-stripped) React Router route and set
 * `http.route`. The OpenTelemetry HTTP instrumentation only sees the raw request — and express is not
 * auto-instrumented in the bundle — so without this every page request would produce a span named by
 * method only. We use the route *pattern* (not the raw path) to keep span/metric cardinality low. A no-op
 * when no span is recording or no route matches. */
export const spanNamingMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const span = trace.getActiveSpan();
  if (span) {
    const { basepath } = getLocaleInfoFromPath(req.path);
    const matched = routes.find((route) => matchPath(route, basepath));
    if (matched) {
      span.updateName(`${req.method} ${matched}`);
      span.setAttribute("http.route", matched);
    }
  }
  next();
};
