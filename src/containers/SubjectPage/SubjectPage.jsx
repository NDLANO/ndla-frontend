/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';

import SubjectContainer from './SubjectContainer';
import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectPageQueryWithTopics } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import MovedTopicPage from './components/MovedTopicPage';

const SubjectPage = ({
  match,
  location,
  history,
  locale,
  skipToContentId,
  ndlaFilm,
}) => {
  const { subjectId, topicList, topicId } = getUrnIdsFromProps({
    ndlaFilm,
    match,
  });
  const { loading, data } = useGraphQuery(subjectPageQueryWithTopics, {
    variables: {
      subjectId,
      topicId: topicId || '',
    },
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const alternateTopics = data?.topic?.alternateTopics;
  if (!data?.subject && alternateTopics?.length >= 1) {
    if (alternateTopics.length === 1) {
      return <Redirect to={alternateTopics[0].path} />;
    }
    return <MovedTopicPage topics={alternateTopics} />;
  }

  if (!data.subject) {
    return <NotFoundPage />;
  }

  // Pre-select topic if only one topic in subject
  if (!topicList.length && data.subject.topics.length === 1) {
    const topic = data.subject.topics[0];
    topicList.push(topic.id);
  }

  return (
    <SubjectContainer
      match={match}
      location={location}
      history={history}
      locale={locale}
      skipToContentId={skipToContentId}
      ndlaFilm={ndlaFilm}
      subjectId={subjectId}
      topics={topicList}
      data={data}
      loading={loading}
    />
  );
};

SubjectPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string.isRequired,
};

export default withRouter(SubjectPage);
