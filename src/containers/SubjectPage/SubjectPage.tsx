/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import { gql } from "@apollo/client";
import SubjectContainer, { subjectContainerFragments } from "./SubjectContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD } from "../../constants";
import { GQLSubjectPageQuery, GQLSubjectPageQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

const subjectPageQuery = gql`
  query subjectPage($subjectId: String!, $metadataFilterKey: String, $metadataFilterValue: String) {
    node(id: $subjectId) {
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

interface Props {
  subjectId: string;
  subjectType?: string;
}

const SubjectPage = ({ subjectId, subjectType }: Props) => {
  const {
    loading,
    data: newData,
    previousData,
  } = useGraphQuery<GQLSubjectPageQuery, GQLSubjectPageQueryVariables>(subjectPageQuery, {
    variables: {
      subjectId: subjectId!,
      metadataFilterKey: OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD,
      metadataFilterValue: subjectId,
    },
  });

  const data = newData ?? previousData;

  if (!data && !loading) {
    return <DefaultErrorMessagePage />;
  }

  if (!data) {
    return <ContentPlaceholder />;
  }

  if (!data.node || !subjectId) {
    const redirect = data.nodes?.[0];
    if (!redirect) {
      return <NotFoundPage />;
    } else {
      return <Navigate to={redirect.path || ""} replace />;
    }
  }

  return <SubjectContainer node={data.node} subjectType={subjectType} loading={loading} />;
};

export default SubjectPage;
