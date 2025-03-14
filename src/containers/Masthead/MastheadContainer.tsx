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
import { gql, useQuery } from "@apollo/client";
import { Feide, UserLine } from "@ndla/icons";
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
import {
  GQLContextQuery,
  GQLContextQueryVariables,
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
} from "../../graphqlTypes";
import { preferredLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";
import { contextQuery } from "../../queries";
import { useUrnIds } from "../../routeHelpers";
import { isValidContextId } from "../../util/urlHelper";
import { ErrorBoundary } from "../ErrorPage/ErrorBoundary";

const FeideLoginLabel = styled("span", {
  base: {
    tabletDown: {
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
    gap: "4xsmall",
    flex: "1",
    tablet: {
      gap: "small",
    },
  },
});

const mastheadQuery = gql`
  query mastHead($subjectId: String!) {
    root: node(id: $subjectId) {
      ...MastheadDrawer_Root
    }
  }
  ${MastheadDrawer.fragments.root}
`;

const MastheadContainer = () => {
  const { t, i18n } = useTranslation();
  const { contextId, subjectId: maybeSubjectId, topicList } = useUrnIds();
  const { user } = useContext(AuthContext);
  const { openAlerts, closeAlert } = useAlerts();
  const { data: rootData, loading: rootLoading } = useQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: !isValidContextId(contextId) || typeof window === "undefined",
  });
  const nodeType = rootData?.node?.nodeType;
  const maybeTopicId = nodeType === "TOPIC" ? rootData?.node?.id : undefined;
  const subjectId = rootData?.node?.context?.rootId || maybeSubjectId;
  const parentIds = rootData?.node?.context?.parentIds?.filter((id) => id !== subjectId) ?? [];
  const crumbs = maybeTopicId ? parentIds?.concat(maybeTopicId) : parentIds || topicList;

  const { data: freshData, previousData } = useQuery<GQLMastHeadQuery, GQLMastHeadQueryVariables>(mastheadQuery, {
    variables: {
      subjectId: subjectId!,
    },
    skip: rootLoading || !subjectId || nodeType === "PROGRAMME" || typeof window === "undefined",
  });

  const data = subjectId ? freshData ?? previousData : undefined;

  const alerts = openAlerts?.map((alert) => ({
    content: alert.body ? parse(alert.body) : alert.title,
    closable: alert.closable,
    number: alert.number,
  }));

  return (
    <ErrorBoundary>
      <Masthead skipToMainContentId={SKIP_TO_CONTENT_ID} onCloseAlert={(id) => closeAlert(id)} messages={alerts}>
        <DrawerWrapper>
          <MastheadDrawer root={data?.root} crumbs={crumbs} />
          <MastheadSearch />
        </DrawerWrapper>
        <SafeLink to="/" aria-label="NDLA" title="NDLA">
          <NdlaLogoText />
        </SafeLink>
        <ButtonWrapper>
          <StyledLanguageSelector
            languages={preferredLanguages}
            onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
          />
          <FeideLoginButton>
            <FeideLoginLabel data-hj-suppress>{user ? t("myNdla.myNDLA") : t("login")}</FeideLoginLabel>
            {user ? <UserLine /> : <Feide />}
          </FeideLoginButton>
        </ButtonWrapper>
      </Masthead>
    </ErrorBoundary>
  );
};

export default MastheadContainer;
