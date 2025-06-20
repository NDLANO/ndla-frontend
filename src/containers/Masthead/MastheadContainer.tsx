/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Feide, UserLine } from "@ndla/icons";
import { NdlaLogoText } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import Masthead from "./components/Masthead";
import MastheadSearch from "./components/MastheadSearch";
import MastheadDrawer from "./drawer/MastheadDrawer";
import { AuthContext } from "../../components/AuthenticationContext";
import FeideLoginButton from "../../components/FeideLoginButton";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLContextQuery,
  GQLContextQueryVariables,
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
} from "../../graphqlTypes";
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

const contextQuery = gql`
  query Context($contextId: String!) {
    node(contextId: $contextId) {
      id
      nodeType
      context {
        contextId
        rootId
        parentIds
        url
      }
    }
  }
`;

interface Props {
  showAlerts?: boolean;
}

const MastheadContainer = ({ showAlerts }: Props) => {
  const { t } = useTranslation();
  const { contextId } = useParams();
  const { user } = useContext(AuthContext);
  const { data: rootData, loading: rootLoading } = useQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: !isValidContextId(contextId) || typeof window === "undefined",
  });
  const nodeType = rootData?.node?.nodeType;
  const maybeTopicId = nodeType === "TOPIC" ? rootData?.node?.id : undefined;
  const subjectId = rootData?.node?.context?.rootId;
  const parentIds = rootData?.node?.context?.parentIds?.filter((id) => id !== subjectId) ?? [];
  const crumbs = maybeTopicId ? parentIds?.concat(maybeTopicId) : parentIds;

  const { data: freshData } = useQuery<GQLMastHeadQuery, GQLMastHeadQueryVariables>(mastheadQuery, {
    variables: {
      subjectId: subjectId!,
    },
    skip: rootLoading || !subjectId || nodeType === "PROGRAMME" || typeof window === "undefined",
  });

  const data = subjectId ? freshData : undefined;

  return (
    <ErrorBoundary>
      <Masthead skipToMainContentId={SKIP_TO_CONTENT_ID} showAlerts={showAlerts}>
        <DrawerWrapper>
          <MastheadDrawer root={data?.root} crumbs={crumbs} />
          <MastheadSearch root={data?.root} />
        </DrawerWrapper>
        <SafeLink to="/" aria-label="NDLA" title="NDLA">
          <NdlaLogoText />
        </SafeLink>
        <ButtonWrapper>
          <StyledLanguageSelector />
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
