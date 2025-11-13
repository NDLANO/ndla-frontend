/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { PresentationLine, LoginBoxLine } from "@ndla/icons";
import {
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageContent,
  ErrorMessageActions,
  Button,
} from "@ndla/primitives";

import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { Status } from "../../components/Status";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { toHref } from "../../util/urlHelper";

const StyledPresentationLine = styled(PresentationLine, {
  base: {
    flexShrink: "0",
    width: "surface.xsmall",
    height: "surface.xsmall",
  },
});

export const AccessDeniedPage = () => {
  return (
    <PageContainer asChild consumeCss>
      <main>
        <AccessDenied applySkipToContentId={true} />
      </main>
    </PageContainer>
  );
};

export const Component = AccessDeniedPage;

interface AccessDeniedProps {
  applySkipToContentId?: boolean;
}

export const AccessDenied = ({ applySkipToContentId }: AccessDeniedProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { authenticated } = useContext(AuthContext);
  const statusCode = authenticated ? 403 : 401;

  return (
    <Status code={statusCode}>
      <ErrorMessageRoot>
        <PageTitle title={t("htmlTitles.accessDenied")} />
        <StyledPresentationLine />
        <ErrorMessageContent>
          <ErrorMessageDescription id={applySkipToContentId ? SKIP_TO_CONTENT_ID : undefined}>
            {t("user.resource.accessDenied")}
          </ErrorMessageDescription>
        </ErrorMessageContent>
        <SafeLinkButton reloadDocument to={`/login?state=${toHref(location)}`}>
          {t("user.buttonLogIn")}
          <LoginBoxLine />
        </SafeLinkButton>
        <ErrorMessageActions>
          <SafeLink to="/">{t("errorMessage.goToFrontPage")}</SafeLink>
          <Button variant="link" onClick={() => window.history.back()}>
            {t("errorMessage.back")}
          </Button>
        </ErrorMessageActions>
      </ErrorMessageRoot>
    </Status>
  );
};
