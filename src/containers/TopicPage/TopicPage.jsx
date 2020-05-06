/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import TopicContainer from './TopicContainer';
import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { topicPageQuery } from '../../queries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';

const TopicPage = ({
  location,
  ndlaFilm,
  match,
  locale,
  t,
  skipToContentId,
}) => {
  const filterIds = getFiltersFromUrl(location);
  const { subjectId, topicId } = getUrnIdsFromProps({ ndlaFilm, match });
  const { data, loading, error } = useGraphQuery(topicPageQuery, {
    variables: { topicId, filterIds, subjectId },
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
      t={t}
      skipToContentId={skipToContentId}
      subjectId={subjectId}
      topicId={topicId}
      data={data}
      error={error}
    />
  );
};

TopicPage.defaultProps = {
  basename: '',
};

TopicPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  location: LocationShape,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string.isRequired,
  basename: PropTypes.string,
};

export default injectT(TopicPage);
