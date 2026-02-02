/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPlainLearningpathPageQuery, GQLPlainLearningpathPageQueryVariables } from "../../graphqlTypes";
import { PlainLearningpathContainer, plainLearningpathContainerFragments } from "./PlainLearningpathContainer";

const plainLearningpathPageQuery = gql`
  query plainLearningpathPage($pathId: String!, $transformArgs: TransformedArticleContentInput) {
    learningpath(pathId: $pathId) {
      ...PlainLearningpathContainer_Learningpath
    }
  }
  ${plainLearningpathContainerFragments.learningpath}
`;

export const PlainLearningpathPage = () => {
  const { learningpathId, stepId } = useParams();

  const { data, loading } = useQuery<GQLPlainLearningpathPageQuery, GQLPlainLearningpathPageQueryVariables>(
    plainLearningpathPageQuery,
    {
      variables: {
        pathId: learningpathId ?? "",
      },
      skip: !learningpathId,
    },
  );

  if (loading) {
    return <ContentPlaceholder />;
  }
  if (!data || !data.learningpath || (data.learningpath.learningsteps?.length ?? 0) < 1) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <PlainLearningpathContainer learningpath={data.learningpath} skipToContentId={SKIP_TO_CONTENT_ID} stepId={stepId} />
  );
};

export const Component = PlainLearningpathPage;
