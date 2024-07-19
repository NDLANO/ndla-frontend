/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OneColumn, ErrorMessage, ArticleWrapper } from "@ndla/ui";
import { AccessDeniedCodes } from "../../../util/handleError";
import AccessDeniedPage from "../../AccessDeniedPage/AccessDeniedPage";

interface Props {
  status?: number;
  children?: ReactNode;
}

const ArticleErrorMessage = ({ status, children }: Props) => {
  const { t } = useTranslation();

  if (AccessDeniedCodes.includes(status ?? 0)) return <AccessDeniedPage />;

  return (
    <OneColumn>
      <ArticleWrapper>
        <ErrorMessage
          illustration={{
            url: status === 404 ? "/static/not-exist.gif" : "/static/oops.gif",
            altText: t("errorMessage.title"),
          }}
          messages={{
            title: t("errorMessage.title"),
            description: status === 404 ? t("articlePage.error404Description") : t("articlePage.errorDescription"),
            goToFrontPage: t("errorMessage.goToFrontPage"),
          }}
        />
        {children}
      </ArticleWrapper>
    </OneColumn>
  );
};

export default ArticleErrorMessage;
