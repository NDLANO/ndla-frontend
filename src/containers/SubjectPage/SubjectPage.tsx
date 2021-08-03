/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import SubjectContainer from './SubjectContainer';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectPageQueryWithTopics } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import MovedTopicPage from './components/MovedTopicPage';
import { LocaleType } from '../../interfaces';

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
  const { subjectId, topicList, topicId } = getUrnIdsFromProps({
    ndlaFilm,
    match,
  });

  const initialLoad = useRef(true);
  const isFirstRenderWithTopicId = () => initialLoad.current && !!topicId;

  const { loading, data } = useGraphQuery(subjectPageQueryWithTopics, {
    variables: {
      subjectId,
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
  if (!data?.subject && alternateTopics?.length >= 1) {
    if (alternateTopics.length === 1) {
      return <Redirect to={alternateTopics[0].path} />;
    }
    return <MovedTopicPage topics={alternateTopics} />;
  }

  if (!data.subject || !subjectId) {
    return <NotFoundPage />;
  }

  // Pre-select topic if only one topic in subject
  if (!topicList.length && data.subject.topics.length === 1) {
    const topic = data.subject.topics[0];
    topicList.push(topic.id);
  }

  initialLoad.current = false;

  return (
    <SubjectContainer
      locale={locale}
      skipToContentId={skipToContentId}
      ndlaFilm={ndlaFilm}
      subjectId={subjectId}
      topicIds={topicList}
      data={data}
      loading={loading}
    />
  );
};

export default withRouter(SubjectPage);
