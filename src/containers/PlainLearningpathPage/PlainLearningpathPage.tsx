/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { Spinner } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router';

import { learningPathStepQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { useGraphQuery } from '../../util/runQueries';
import PlainLearningpathContainer from './PlainLearningpathContainer';
import { GQLLearningPathStepQuery } from '../../graphqlTypes';
import { RootComponentProps } from '../../routes';
import { AuthContext } from '../../components/AuthenticationContext';

interface MatchParams {
  learningpathId: string;
  stepId?: string;
}

interface Props extends RootComponentProps, RouteComponentProps<MatchParams> {}
const PlainLearningpathPage = ({ locale, skipToContentId, match }: Props) => {
  const { stepId, learningpathId } = match.params;
  const { user } = useContext(AuthContext);

  const { data, loading } = useGraphQuery<GQLLearningPathStepQuery>(
    learningPathStepQuery,
    {
      variables: { pathId: learningpathId },
    },
  );

  if (loading) {
    return <Spinner />;
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
      locale={locale}
      skipToContentId={skipToContentId}
      stepId={stepId}
      user={user}
    />
  );
};

export default withRouter(PlainLearningpathPage);
