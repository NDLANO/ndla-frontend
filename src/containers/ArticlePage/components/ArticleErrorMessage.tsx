/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultErrorMessagePage } from "../../../components/DefaultErrorMessage";
import { AccessDeniedCodes } from "../../../util/handleError";
import { AccessDeniedPage } from "../../AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";

interface Props {
  status?: number;
}

export const ArticleErrorMessage = ({ status }: Props) => {
  if (AccessDeniedCodes.includes(status ?? 0)) return <AccessDeniedPage />;
  if (status === 404) return <NotFoundPage />;
  return <DefaultErrorMessagePage />;
};

export default ArticleErrorMessage;
