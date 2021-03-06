/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import SubjectContainer from './SubjectContainer';
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
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm,
    match,
  });
  const filterIds = getFiltersFromUrl(location);
  const { loading, data } = useGraphQuery(subjectPageQuery, {
    variables: {
      subjectId,
      filterIds,
    },
  });

  useEffect(() => {
    if (data) {
      const filterIdsArray = filterIds.split(',');
      const subjectFilters =
        data?.subject?.filters?.map(filter => filter.id) || [];
      const sharedFilters = subjectFilters?.filter(id =>
        filterIdsArray.includes(id),
      );
      if (
        sharedFilters.length < filterIdsArray.length &&
        data.subject.path === location.pathname
      ) {
        history.replace({
          search: subjectFilters.length
            ? `?filters=${
                sharedFilters.length ? sharedFilters.join() : subjectFilters[0]
              }`
            : '',
        });
      }
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
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
