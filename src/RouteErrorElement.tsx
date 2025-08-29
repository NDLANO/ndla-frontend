/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRouteError } from "react-router";
import config from "./config";
import ErrorPage from "./containers/ErrorPage";
import handleError from "./util/handleError";

export const ErrorElement = () => {
  const error = useRouteError();
  if (config.runtimeType === "production") {
    handleError(error as Error);
  }
  return <ErrorPage />;
};
