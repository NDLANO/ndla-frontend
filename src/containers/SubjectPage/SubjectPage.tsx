/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useRef } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import SubjectContainer from './SubjectContainer';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectPageQueryWithTopics } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import MovedTopicPage from './components/MovedTopicPage';
import { OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD } from '../../constants';
import { LocaleType } from '../../interfaces';
import { AuthContext } from '../../components/AuthenticationContext';
import {
  GQLSubjectPageWithTopicsQuery,
  GQLSubjectPageWithTopicsQueryVariables,
} from '../../graphqlTypes';

type MatchParams = {
  subjectId?: string;
  topicPath?: string;
  topicId?: string;
  resourceId?: string;
  articleId?: string;
};

interface Props extends RouteComponentProps<MatchParams> {
  locale: LocaleType;
  skipToContentId: string;
  ndlaFilm?: boolean;
}

const SubjectPage = ({ match, locale, skipToContentId, ndlaFilm }: Props) => {
  const { user } = useContext(AuthContext);
  const { subjectId, topicList, topicId } = getUrnIdsFromProps({
    ndlaFilm,
    match,
  });

  const initialLoad = useRef(true);
  const isFirstRenderWithTopicId = () => initialLoad.current && !!topicId;

  const { loading, data } = useGraphQuery<
    GQLSubjectPageWithTopicsQuery,
    GQLSubjectPageWithTopicsQueryVariables
  >(subjectPageQueryWithTopics, {
    variables: {
      subjectId: subjectId!,
      topicId: topicId || '',
      includeTopic: isFirstRenderWithTopicId(),
    },
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const alternateTopics = data.topic?.alternateTopics;
  if (!data?.subject && alternateTopics && alternateTopics.length >= 1) {
    if (alternateTopics.length === 1) {
      return <Redirect to={alternateTopics[0]!.path!} />;
    }
    return <MovedTopicPage topics={alternateTopics} />;
  }

  if (!data.subject || !subjectId) {
    const redirect = data.subjects?.find(sub => {
      const customFields = sub.metadata?.customFields;
      return customFields[OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD] === subjectId;
    });
    if (!redirect) {
      return <NotFoundPage />;
    } else {
      return <Redirect to={redirect.path || ''} />;
    }
  }

  // Pre-select topic if only one topic in subject
  if (!topicList.length && data.subject?.topics?.length === 1) {
    const topic = data.subject.topics[0];
    topicList.push(topic!.id);
  }

  initialLoad.current = false;

  return (
    <SubjectContainer
      locale={locale}
      skipToContentId={skipToContentId}
      ndlaFilm={ndlaFilm}
      subjectId={subjectId}
      topicIds={topicList}
      subject={data.subject}
      loading={loading}
      user={user}
    />
  );
};

export default withRouter(SubjectPage);
