/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import SubjectContainer, { subjectContainerFragments } from "./SubjectContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD } from "../../constants";
import FilmFrontpage from "../../containers/FilmFrontpage/FilmFrontpage";
import { GQLSubjectPageQuery, GQLSubjectPageQueryVariables } from "../../graphqlTypes";
import { getSubjectType, useUrnIds } from "../../routeHelpers";
import { isValidContextId } from "../../util/urlHelper";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

const subjectPageQuery = gql`
  query subjectPage($subjectId: String, $contextId: String, $metadataFilterKey: String, $metadataFilterValue: String) {
    node(id: $subjectId, contextId: $contextId) {
      ...SubjectContainer_Node
    }
    nodes(metadataFilterKey: $metadataFilterKey, metadataFilterValue: $metadataFilterValue, filterVisible: true) {
      path
      metadata {
        customFields
      }
    }
  }
  ${subjectContainerFragments.subject}
`;

const SubjectPage = () => {
  const { contextId, subjectId } = useUrnIds();
  const {
    error,
    loading,
    data: newData,
    previousData,
  } = useQuery<GQLSubjectPageQuery, GQLSubjectPageQueryVariables>(subjectPageQuery, {
    variables: {
      subjectId: subjectId,
      contextId: contextId,
      metadataFilterKey: OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD,
      metadataFilterValue: subjectId,
    },
    skip: !!contextId && !isValidContextId(contextId),
  });

  const data = newData ?? previousData;

  if (error?.graphQLErrors.some((err) => err.extensions?.status === 404)) {
    return <NotFoundPage />;
  }

  if (!data && !loading) {
    return <DefaultErrorMessagePage />;
  }

  if (!data) {
    return <ContentPlaceholder />;
  }

  if (!data.node) {
    const redirect = data.nodes?.[0];
    if (!redirect) {
      return <NotFoundPage />;
    } else {
      return <Navigate to={redirect.path || ""} replace />;
    }
  }
  const subjectType = getSubjectType(data.node.id);
  if (subjectType === "film") {
    return <FilmFrontpage />;
  }

  return <SubjectContainer node={data.node} subjectType={subjectType} loading={loading} />;
};

export default SubjectPage;
