/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Button,
  ErrorMessageActions,
  ErrorMessageContent,
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageTitle,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LinkProps, useNavigate } from "react-router";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { Status } from "../../components/Status";
import { SKIP_TO_CONTENT_ID } from "../../constants";

interface Props {
  applySkipToContentId?: boolean;
  navigationLink?: LinkProps & { children: ReactNode };
}

export const Forbidden = ({ applySkipToContentId, navigationLink }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { children, ...linkProps } = navigationLink ?? { to: "/", children: t("errorMessage.goToFrontPage") };

  return (
    <Status code={403}>
      <ErrorMessageRoot>
        <PageTitle title={t("htmlTitles.forbidden")} />
        <img src={"/static/not-exist.gif"} alt={t("errorMessage.title")} />
        <ErrorMessageContent>
          <ErrorMessageTitle id={applySkipToContentId ? SKIP_TO_CONTENT_ID : undefined}>
            {t("forbiddenPage.title")}
          </ErrorMessageTitle>
          <ErrorMessageDescription>{t("forbiddenPage.errorDescription")}</ErrorMessageDescription>
        </ErrorMessageContent>
        <ErrorMessageActions>
          <SafeLink {...linkProps}>{children}</SafeLink>
          <Button variant="link" onClick={() => navigate(-1)}>
            {t("errorMessage.back")}
          </Button>
        </ErrorMessageActions>
      </ErrorMessageRoot>
    </Status>
  );
};

export const ForbiddenPage = (props: Props) => {
  return (
    <PageContainer asChild consumeCss>
      <main>
        <Forbidden applySkipToContentId={true} {...props} />
      </main>
    </PageContainer>
  );
};
