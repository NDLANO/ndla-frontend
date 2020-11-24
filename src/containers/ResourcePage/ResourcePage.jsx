/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { resourcePageQuery } from '../../queries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { isLearningPathResource } from '../Resources/resourceHelpers';
import LearningpathPage from '../LearningpathPage/LearningpathPage';
import ArticlePage from '../ArticlePage/ArticlePage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import MovedResourcePage from '../MovedResourcePage/MovedResourcePage';
import { useGraphQuery } from '../../util/runQueries';
import { LocationShape } from '../../shapes';

const urlInPaths = (location, resource) => {
  return resource.paths?.find(p => location.pathname.includes(p));
};

const ResourcePage = props => {
  const { subjectId, resourceId, topicId } = getUrnIdsFromProps(props);
  const filterIds = getFiltersFromUrl(props.location);
  const { error, loading, data } = useGraphQuery(resourcePageQuery, {
    variables: { subjectId, topicId, filterIds, resourceId },
  });

  useEffect(() => {
    if (data?.resource?.filters?.length && !getFiltersFromUrl(props.location)) {
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
  }, [data]);

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (data.resource && !urlInPaths(props.location, data.resource)) {
    return <MovedResourcePage resource={data.resource} locale={props.locale} />;
  }

  if (!data.resource) {
    return <NotFoundPage />;
  }
  const { subject, topic } = data;
  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  if (isLearningPathResource(data.resource)) {
    return (
      <LearningpathPage
        {...props}
        data={{ ...data, topicPath }}
        errors={error?.graphQLErrors}
      />
    );
  }
  return (
    <ArticlePage
      {...props}
      data={{ ...data, topicPath }}
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

export default ResourcePage;
