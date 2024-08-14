/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import PlainLearningpathContainer, { plainLearningpathContainerFragments } from "./PlainLearningpathContainer";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPlainLearningpathPageQuery, GQLPlainLearningpathPageQueryVariables } from "../../graphqlTypes";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";

interface MatchParams extends TypedParams {
  learningpathId: string;
  stepId?: string;
}

const plainLearningpathPageQuery = gql`
  query plainLearningpathPage($pathId: String!, $transformArgs: TransformedArticleContentInput) {
    learningpath(pathId: $pathId) {
      ...PlainLearningpathContainer_Learningpath
    }
  }
  ${plainLearningpathContainerFragments.learningpath}
`;

const PlainLearningpathPage = () => {
  const { learningpathId, stepId } = useTypedParams<MatchParams>();

  const { data, loading } = useGraphQuery<GQLPlainLearningpathPageQuery, GQLPlainLearningpathPageQueryVariables>(
    plainLearningpathPageQuery,
    {
      variables: {
        pathId: learningpathId,
      },
    },
  );

  if (loading) {
    return <ContentPlaceholder />;
  }
  if (!data || !data.learningpath || (data.learningpath.learningsteps?.length ?? 0) < 1) {
    return <DefaultErrorMessage />;
  }

  return (
    <PlainLearningpathContainer learningpath={data.learningpath} skipToContentId={SKIP_TO_CONTENT_ID} stepId={stepId} />
  );
};

export default PlainLearningpathPage;
