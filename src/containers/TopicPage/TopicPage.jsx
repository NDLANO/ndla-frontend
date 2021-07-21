/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import TopicContainer from './TopicContainer';
import { getUrnIdsFromProps } from '../../routeHelpers';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { topicPageQuery } from '../../queries';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import { LocationShape } from '../../graphqlShapes';

const TopicPage = ({ location, ndlaFilm, match, locale, skipToContentId }) => {
  const { subjectId, topicId } = getUrnIdsFromProps({ ndlaFilm, match });
  const { data, loading, error } = useGraphQuery(topicPageQuery, {
    variables: { topicId, subjectId },
  });
  if (loading) return null;

  if (!data) {
    return <DefaultErrorMessage />;
  }
  if (!data.topic) {
    return <NotFoundPage />;
  }

  return (
    <TopicContainer
      location={location}
      ndlaFilm={ndlaFilm}
      locale={locale}
      skipToContentId={skipToContentId}
      subjectId={subjectId}
      topicId={topicId}
      data={data}
      loading={loading}
      error={error}
    />
  );
};

TopicPage.propTypes = {
  skipToContentId: PropTypes.string,
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string,
  location: LocationShape,
  ndlaFilm: PropTypes.bool,
};

export default TopicPage;
