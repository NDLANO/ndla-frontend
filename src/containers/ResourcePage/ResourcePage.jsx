/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { resourcePageQuery } from '../../queries';
import { getFiltersFromUrlAsArray } from '../../util/filterHelper';
import { isLearningPathResource } from '../Resources/resourceHelpers';
import LearningpathPage from '../LearningpathPage/LearningpathPage';
import ArticlePage from '../ArticlePage/ArticlePage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import MovedResourcePage from '../MovedResourcePage/MovedResourcePage';
import { useGraphQuery } from '../../util/runQueries';
import { LocationShape } from '../../shapes';
import { RELEVANCE_SUPPLEMENTARY } from '../../constants';

const urlInPaths = (location, resource) => {
  return resource.paths?.find(p => location.pathname.includes(p));
};

const ResourcePage = props => {
  const { subjectId, resourceId, topicId } = getUrnIdsFromProps(props);
  const filters = getFiltersFromUrlAsArray(props.location);
  const filterIds = filters.join(',');
  const { error, loading, data } = useGraphQuery(resourcePageQuery, {
    variables: { subjectId, topicId, filterIds, resourceId },
  });

  useEffect(() => {
    if (data?.resource?.filters?.length && !filterIds) {
      const resourceFilterOnTopic = data.resource.filters.filter(filter =>
        data?.topic?.filters?.map(filter => filter.id).includes(filter.id),
      );
      const filter = resourceFilterOnTopic?.[0];
      if (filter) {
        props.history.replace({
          search: `?filters=${filter.id}`,
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

  if (!data.resource && !data.resource.article && !data.resource.learningpath) {
    return <NotFoundPage />;
  }

  if (data.resource && !urlInPaths(props.location, data.resource)) {
    if (data.resource.paths?.length === 1) {
      return <Redirect to={data.resource.paths[0]} />;
    } else {
      return (
        <MovedResourcePage resource={data.resource} locale={props.locale} />
      );
    }
  }

  if (typeof window != 'undefined' && window.scrollY) {
    window.scroll(0, 0);
  }
  const { subject, resource, topic } = data;
  const relevanceId = resource.filters?.find(f => f.id === filters?.[0])
    ?.relevanceId;
  const relevance =
    relevanceId === RELEVANCE_SUPPLEMENTARY
      ? props.t('searchPage.searchFilterMessages.supplementaryRelevance')
      : props.t('searchPage.searchFilterMessages.coreRelevance');
  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  if (isLearningPathResource(resource)) {
    return (
      <LearningpathPage
        {...props}
        data={{ ...data, relevance, topicPath }}
        errors={error?.graphQLErrors}
      />
    );
  }
  return (
    <ArticlePage
      {...props}
      data={{ ...data, relevance, topicPath }}
      errors={error?.graphQLErrors}
    />
  );
};

ResourcePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicList: PropTypes.arrayOf(PropTypes.string.isRequired),
      topicId: PropTypes.string,
      resourceId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string,
  location: LocationShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(ResourcePage);
