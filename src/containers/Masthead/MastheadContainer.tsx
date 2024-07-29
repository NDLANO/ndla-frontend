/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, mq, spacing } from "@ndla/core";
import { Feide } from "@ndla/icons/common";
import { NdlaLogoText } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import Masthead from "./components/Masthead";
import MastheadSearch from "./components/MastheadSearch";
import MastheadDrawer from "./drawer/MastheadDrawer";
import { useAlerts } from "../../components/AlertsContext";
import { AuthContext } from "../../components/AuthenticationContext";
import FeideLoginButton from "../../components/FeideLoginButton";
import { LanguageSelector } from "../../components/LanguageSelector";
import config from "../../config";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLMastHeadQuery, GQLMastHeadQueryVariables } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import ErrorBoundary from "../ErrorPage/ErrorBoundary";

const FeideLoginLabel = styled.span`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledLanguageSelector = styled(LanguageSelector)`
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const DrawerWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${spacing.small};
  flex: 1;
`;

const mastheadQuery = gql`
  query mastHead($subjectId: String!) {
    subject(id: $subjectId) {
      ...MastheadDrawer_Subject
    }
  }
  ${MastheadDrawer.fragments.subject}
`;

const MastheadContainer = () => {
  const { t, i18n } = useTranslation();
  const { subjectId } = useUrnIds();
  const { user } = useContext(AuthContext);
  const { openAlerts, closeAlert } = useAlerts();
  const { data: freshData, previousData } = useGraphQuery<GQLMastHeadQuery, GQLMastHeadQueryVariables>(mastheadQuery, {
    variables: {
      subjectId: subjectId!,
    },
    skip: !subjectId || typeof window === "undefined",
  });

  const data = subjectId ? freshData ?? previousData : undefined;

  const alerts = openAlerts?.map((alert) => ({
    content: alert.body ? parse(alert.body) : alert.title,
    closable: alert.closable,
    number: alert.number,
  }));

  return (
    <ErrorBoundary>
      <Masthead fixed skipToMainContentId={SKIP_TO_CONTENT_ID} onCloseAlert={(id) => closeAlert(id)} messages={alerts}>
        <DrawerWrapper>
          <MastheadDrawer subject={data?.subject} />
          <MastheadSearch />
        </DrawerWrapper>
        <SafeLink to="/" aria-label="NDLA" title="NDLA">
          <NdlaLogoText />
        </SafeLink>
        <ButtonWrapper>
          <StyledLanguageSelector
            items={supportedLanguages}
            onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
          />
          {config.feideEnabled && (
            <FeideLoginButton>
              <FeideLoginLabel data-hj-suppress>{user ? t("myNdla.myNDLA") : t("login")}</FeideLoginLabel>
              <Feide />
            </FeideLoginButton>
          )}
        </ButtonWrapper>
      </Masthead>
    </ErrorBoundary>
  );
};

export default MastheadContainer;
