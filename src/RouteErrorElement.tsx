/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useRef } from "react";
import { useRouteError } from "react-router";
import config from "./config";
import { ErrorPage } from "./containers/ErrorPage/ErrorPage";
import { handleError } from "./util/handleError";
import { consumeReloadGuard, hadChunkReloadAttempt, isChunkLoadError, triggerCrashReload } from "./util/skewDetection";

interface Props {
  children?: ReactNode;
}

export const ErrorElement = ({ children }: Props) => {
  const error = useRouteError();
  const isChunk = isChunkLoadError(error);
  const hadAttempt = useRef(isChunk && hadChunkReloadAttempt()).current;

  if (isChunk) {
    if (hadAttempt) {
      consumeReloadGuard();
      if (config.runtimeType === "production") handleError(error as Error);
    } else {
      triggerCrashReload();
      return null;
    }
  } else if (config.runtimeType === "production") {
    handleError(error as Error);
  }

  return children ?? <ErrorPage />;
};
