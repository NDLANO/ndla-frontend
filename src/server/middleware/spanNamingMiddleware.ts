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
