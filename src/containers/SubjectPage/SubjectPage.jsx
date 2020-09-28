/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import SubjectContainer from './SubjectContainer';
import MultidisciplinarySubjectPage from './MultidisciplinarySubjectPage';
import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectPageQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { useGraphQuery } from '../../util/runQueries';

const SubjectPage = ({
  match,
  location,
  history,
  locale,
  skipToContentId,
  ndlaFilm,
}) => {
  const { subjectId, topicId, subTopicId, subSubTopicId } = getUrnIdsFromProps({
    ndlaFilm,
    match,
  });
  const { loading, data } = useGraphQuery(subjectPageQuery, {
    variables: {
      subjectId,
      filterIds: getFiltersFromUrl(location),
    },
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.subject) {
    return <NotFoundPage />;
  }

  let urlTopicId = topicId;
  // Pre-select topic if only one topic in subject
  if (!urlTopicId && data.subject.topics.length === 1) {
    const topic = data.subject.topics[0];
    urlTopicId = topic.id;
  }

  const { subject } = data;
  if (subject.subjectpage.layout === 'stacked') {
    return (
      <MultidisciplinarySubjectPage
        filters={subject.filters}
        topics={subject.topics}
      />
    );
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
      urlTopicId={urlTopicId}
      urlSubTopicId={subTopicId}
      urlSubSubTopicId={subSubTopicId}
      data={data}
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
