/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useParams } from "react-router";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { RedirectExternal } from "../../components/RedirectExternal";
import { FilmFrontpage } from "../../containers/FilmFrontpage/FilmFrontpage";
import type {
  GQLSubjectPageQuery,
  GQLSubjectPageQueryVariables,
  GQLSubjectVideoSearchQuery,
  GQLSubjectVideoSearchQueryVariables,
} from "../../graphqlTypes";
import { getSubjectType } from "../../routeHelpers";
import { isNotFoundError } from "../../util/handleError";
import { constructNewPath, isValidContextId } from "../../util/urlHelper";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { SubjectContainer } from "./SubjectContainer";

const subjectPageQuery = gql`
  query subjectPage($subjectId: String, $contextId: String, $metadataFilterKey: String, $metadataFilterValue: String) {
    node(id: $subjectId, contextId: $contextId) {
      ...SubjectContainer_Node
    }
    nodes(metadataFilterKey: $metadataFilterKey, metadataFilterValue: $metadataFilterValue, filterVisible: true) {
      url
      metadata {
        customFields
      }
    }
  }
  ${SubjectContainer.fragments.subject}
`;

const videoQueryDef = gql`
  query subjectVideoSearch($subjectId: String!, $language: String!) {
    search(subjects: $subjectId, traits: "VIDEO", language: $language, pageSize: 8) {
      results {
        ...SubjectContainer_SearchResult
      }
    }
  }
  ${SubjectContainer.fragments.searchResult}
`;

export const SubjectPage = () => {
  const { contextId } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();
  const {
    error,
    loading,
    data: newData,
    previousData,
  } = useQuery<GQLSubjectPageQuery, GQLSubjectPageQueryVariables>(subjectPageQuery, {
    variables: { contextId: contextId },
    skip: !isValidContextId(contextId),
  });

  const data = newData ?? previousData;

  const videoQuery = useQuery<GQLSubjectVideoSearchQuery, GQLSubjectVideoSearchQueryVariables>(videoQueryDef, {
    variables: { subjectId: data?.node?.id ?? "", language: i18n.language },
    skip: !data?.node?.id,
  });

  if (error) {
    if (isNotFoundError(error)) {
      return <NotFoundPage />;
    }
    return <DefaultErrorMessagePage />;
  }

  if (!data && !loading) {
    return <NotFoundPage />;
  }

  if (!data || videoQuery.loading) {
    return <ContentPlaceholder />;
  }

  if (!data.node) {
    const redirect = data.nodes?.[0];
    if (!redirect) {
      return <NotFoundPage />;
    } else {
      return <Navigate to={redirect.url || ""} replace />;
    }
  }
  if (i18n.language === "se" && !data.node.supportedLanguages?.includes("se")) {
    return <RedirectExternal to={constructNewPath(location.pathname, "nb")} />;
  }
  const subjectType = getSubjectType(data.node.id);
  if (subjectType === "film") {
    return <FilmFrontpage />;
  }

  return (
    <SubjectContainer
      node={data.node}
      subjectType={subjectType}
      searchResults={videoQuery.data?.search?.results ?? []}
    />
  );
};

export const Component = SubjectPage;
