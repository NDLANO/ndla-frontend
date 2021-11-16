/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteComponentProps } from 'react-router';
import Spinner from '@ndla/ui/lib/Spinner';
import { useGraphQuery } from '../../util/runQueries';
import { topicQueryWithPathTopics } from '../../queries';
import { getUrnIdsFromProps } from '../../routeHelpers';
import MultidisciplinarySubjectArticle from './components/MultidisciplinarySubjectArticle';
import config from '../../config';
import { LocaleType } from '../../interfaces';
import {
  GQLTopicWithPathTopicsQuery,
  GQLTopicWithPathTopicsQueryVariables,
} from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

const MultidisciplinarySubjectArticlePage = ({ match, locale }: Props) => {
  const { topicId, subjectId } = getUrnIdsFromProps({ match });

  const { data, loading } = useGraphQuery<
    GQLTopicWithPathTopicsQuery,
    GQLTopicWithPathTopicsQueryVariables
  >(topicQueryWithPathTopics, {
    variables: {
      topicId: topicId!,
      subjectId: subjectId!,
      showVisualElement: 'true',
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic || !data?.subject) {
    return <DefaultErrorMessage />;
  }

  const { topic, subject, resourceTypes } = data;
  const copyPageUrlLink = topic?.path && config.ndlaFrontendDomain + topic.path;

  return (
    <MultidisciplinarySubjectArticle
      topic={topic}
      subject={subject}
      resourceTypes={resourceTypes}
      copyPageUrlLink={copyPageUrlLink}
      locale={locale}
    />
  );
};

export default MultidisciplinarySubjectArticlePage;
