/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import { IS_CLIENT, IS_TEST } from "../../buildConfig";
import { LoggerContext } from "./loggerContext";

export const getLoggerContext = async (): Promise<LoggerContext | undefined> => {
  return undefined;
  // if (!IS_CLIENT) {
  //   const { getLoggerContextStore } = await import(
  //     /* @vite-ignore */ "../../server/middleware/loggerContextMiddleware"
  //   );
  //   return getLoggerContextStore();
  // }
  // if (IS_CLIENT) {
  //   return {
  //     requestPath: `${window.location.pathname}${window.location.search}`,
  //     correlationID: undefined,
  //   };
  // }
  //
  // if (IS_TEST) return undefined;
  // throw new Error("LoggerContext is not available in this environment");
};
