/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import SubjectContainer, { subjectContainerFragments } from "./SubjectContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import FilmFrontpage from "../../containers/FilmFrontpage/FilmFrontpage";
import { GQLSubjectPageQuery, GQLSubjectPageQueryVariables } from "../../graphqlTypes";
import { getSubjectType } from "../../routeHelpers";
import { isValidContextId } from "../../util/urlHelper";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

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
  ${subjectContainerFragments.subject}
`;

export const SubjectPage = () => {
  const { contextId } = useParams();
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

  if (error?.graphQLErrors) {
    if (error?.graphQLErrors.some((err) => err.extensions?.status === 404)) {
      return <NotFoundPage />;
    }
    return <DefaultErrorMessagePage />;
  }

  if (!data && !loading) {
    return <NotFoundPage />;
  }

  if (!data) {
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
  const subjectType = getSubjectType(data.node.id);
  if (subjectType === "film") {
    return <FilmFrontpage />;
  }

  return <SubjectContainer node={data.node} subjectType={subjectType} loading={loading} />;
};

export const Component = SubjectPage;
