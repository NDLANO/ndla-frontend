/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";
import { LoggerContext } from "./loggerContext";

export const getLoggerContext = async (): Promise<LoggerContext | undefined> => {
  if (typeof __IS_SSR_BUILD__ === "undefined" || __IS_SSR_BUILD__) {
    const { getLoggerContextStore } = await import("../../server/middleware/loggerContextMiddleware");
    return getLoggerContextStore();
  }

  if (config.isClient) {
    return {
      requestPath: `${window.location.pathname}${window.location.search}`,
      correlationID: undefined,
    };
  }

  if (config.runtimeType === "test") return undefined;
  throw new Error("LoggerContext is not available in this environment");
};
