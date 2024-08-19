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
import { Feide } from "@ndla/icons/common";
import { NdlaLogoText } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import Masthead from "./components/Masthead";
import MastheadSearch from "./components/MastheadSearch";
import MastheadDrawer from "./drawer/MastheadDrawer";
import { useAlerts } from "../../components/AlertsContext";
import { AuthContext } from "../../components/AuthenticationContext";
import FeideLoginButton from "../../components/FeideLoginButton";
import { LanguageSelector } from "../../components/LanguageSelector";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLMastHeadQuery, GQLMastHeadQueryVariables } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import ErrorBoundary from "../ErrorPage/ErrorBoundary";

const FeideLoginLabel = styled("span", {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

const StyledLanguageSelector = styled(LanguageSelector, {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: "1",
  },
});

const DrawerWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "small",
    flex: "1",
  },
});

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
        {/* TODO: We're supposed to have another logo here on smaller screens. */}
        <SafeLink to="/" aria-label="NDLA" title="NDLA">
          <NdlaLogoText />
        </SafeLink>
        <ButtonWrapper>
          <StyledLanguageSelector
            items={supportedLanguages}
            onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
          />
          <FeideLoginButton>
            <FeideLoginLabel data-hj-suppress>{user ? t("myNdla.myNDLA") : t("login")}</FeideLoginLabel>
            <Feide />
          </FeideLoginButton>
        </ButtonWrapper>
      </Masthead>
    </ErrorBoundary>
  );
};

export default MastheadContainer;
