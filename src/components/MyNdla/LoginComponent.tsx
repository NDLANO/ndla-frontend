/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { mq, breakpoints, spacing } from "@ndla/core";
import { ModalCloseButton } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { routes } from "../../routeHelpers";
import { toHref } from "../../util/urlHelper";

const LoginComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${spacing.normal};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  ${mq.range({ until: breakpoints.tablet })} {
    grid-template-columns: 70% 30%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledSafelink = styled(SafeLink)`
  margin-left: ${spacing.xsmall};
`;

interface Props {
  masthead?: boolean;
  content?: ReactNode;
}

const LoginComponent = ({ masthead, content }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <LoginComponentContainer>
      {!content && (
        <TitleRow>
          <Heading headingStyle="h2" element="h1">
            <Trans t={t} i18nKey="myNdla.myPage.loginWelcome" />
          </Heading>
        </TitleRow>
      )}
      {content}
      <ContentWrapper>
        <Text textStyle="ingress">{parse(t("myNdla.myPage.loginIngress"))}</Text>
        <Text textStyle="meta-text-medium">
          {t("myNdla.myPage.loginText")}
          <StyledSafelink target="_blank" to="https://ndla.no/article/personvernerklaering">
            {` ${t("myNdla.myPage.loginTextLink")}`}
          </StyledSafelink>
        </Text>
      </ContentWrapper>
      <BottomRow>
        <ButtonRow>
          <ModalCloseButton>
            <Button variant="secondary">{t("cancel")}</Button>
          </ModalCloseButton>
          {/* TODO: Update when SafeLinkButton using new button component is implemented */}
          <SafeLinkButton reloadDocument to={`/login?state=${masthead ? routes.myNdla.root : toHref(location)}`}>
            {t("user.buttonLogIn")}
          </SafeLinkButton>
        </ButtonRow>
      </BottomRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;
