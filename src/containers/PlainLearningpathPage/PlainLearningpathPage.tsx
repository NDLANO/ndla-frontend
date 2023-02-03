/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { ContentPlaceholder } from '@ndla/ui';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { useGraphQuery } from '../../util/runQueries';
import PlainLearningpathContainer, {
  plainLearningpathContainerFragments,
} from './PlainLearningpathContainer';
import {
  GQLPlainLearningpathPageQuery,
  GQLPlainLearningpathPageQueryVariables,
} from '../../graphqlTypes';
import { AuthContext } from '../../components/AuthenticationContext';
import { TypedParams, useTypedParams } from '../../routeHelpers';
import { SKIP_TO_CONTENT_ID } from '../../constants';

interface MatchParams extends TypedParams {
  learningpathId: string;
  stepId?: string;
}

const plainLearningpathPageQuery = gql`
  query plainLearningpathPage($pathId: String!, $convertEmbeds: Boolean) {
    learningpath(pathId: $pathId) {
      ...PlainLearningpathContainer_Learningpath
    }
  }
  ${plainLearningpathContainerFragments.learningpath}
`;

const PlainLearningpathPage = () => {
  const { learningpathId, stepId } = useTypedParams<MatchParams>();
  const { user } = useContext(AuthContext);

  const { data, loading } = useGraphQuery<
    GQLPlainLearningpathPageQuery,
    GQLPlainLearningpathPageQueryVariables
  >(plainLearningpathPageQuery, {
    variables: { pathId: learningpathId },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }
  if (
    !data ||
    !data.learningpath ||
    (data.learningpath.learningsteps?.length ?? 0) < 1
  ) {
    return <DefaultErrorMessage />;
  }

  return (
    <PlainLearningpathContainer
      learningpath={data.learningpath}
      skipToContentId={SKIP_TO_CONTENT_ID}
      stepId={stepId}
      user={user}
    />
  );
};

export default PlainLearningpathPage;
