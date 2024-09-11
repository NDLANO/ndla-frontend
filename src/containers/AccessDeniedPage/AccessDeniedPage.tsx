/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PresentationLine, LoginBoxLine } from "@ndla/icons/common";
import {
  ErrorMessageDescription,
  ErrorMessageRoot,
  ErrorMessageContent,
  ErrorMessageActions,
  Button,
} from "@ndla/primitives";

import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { Status } from "../../components";
import { AuthContext } from "../../components/AuthenticationContext";
import { toHref } from "../../util/urlHelper";

const StyledErrorMessageRoot = styled(ErrorMessageRoot, {
  base: {
    marginBlock: "4xlarge",
  },
});

const StyledPresentationLine = styled(PresentationLine, {
  base: {
    flexShrink: "0",
    width: "surface.xsmall",
    height: "surface.xsmall",
  },
});

export const AccessDenied = ({ skipRedirect }: { skipRedirect?: boolean }) => {
  const { authenticated } = useContext(AuthContext);
  const statusCode = authenticated ? 403 : 401;

  if (skipRedirect) return <BaseAccessDenied />;

  return (
    <Status code={statusCode}>
      <BaseAccessDenied />
    </Status>
  );
};

const BaseAccessDenied = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.accessDenied")} />
      <StyledErrorMessageRoot>
        <StyledPresentationLine />
        <ErrorMessageContent>
          <ErrorMessageDescription>{t("user.resource.accessDenied")}</ErrorMessageDescription>
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
      </StyledErrorMessageRoot>
    </>
  );
};
