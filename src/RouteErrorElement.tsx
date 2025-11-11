/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useRouteError } from "react-router";
import config from "./config";
import { ErrorPage } from "./containers/ErrorPage/ErrorPage";
import { handleError } from "./util/handleError";

interface Props {
  children?: ReactNode;
}

export const ErrorElement = ({ children }: Props) => {
  const error = useRouteError();
  if (config.isProduction) {
    handleError(error as Error);
  }
  return children ?? <ErrorPage />;
};
