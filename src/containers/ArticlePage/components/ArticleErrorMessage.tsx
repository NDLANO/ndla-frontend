/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultErrorMessage } from "../../../components/DefaultErrorMessage";
import { AccessDeniedCodes } from "../../../util/handleError";
import { AccessDenied } from "../../AccessDeniedPage/AccessDeniedPage";
import { NotFound } from "../../NotFoundPage/NotFoundPage";

interface Props {
  status?: number;
}

export const ArticleErrorMessage = ({ status }: Props) => {
  if (AccessDeniedCodes.includes(status ?? 0)) return <AccessDenied />;
  if (status === 404) return <NotFound />;
  return <DefaultErrorMessage />;
};

export default ArticleErrorMessage;
