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
import { useGraphQuery } from '../../util/runQueries';

const ResourcePage = props => {
  useEffect(() => {
    if (window.MathJax) {
      console.log('running matjax thing');
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  });
  const { subjectId, resourceId, topicId } = getUrnIdsFromProps(props);
  const filterIds = getFiltersFromUrl(props.location);
  const { errors, loading, data } = useGraphQuery(resourcePageQuery, {
    variables: { subjectId, topicId, filterIds, resourceId },
  });

  if (loading) {
    return null;
  }

  if (errors && errors.filter(error => error.status === 404).length > 0) {
    return <NotFoundPage />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }
  const { subject, topic } = data;
  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  if (isLearningPathResource(data.resource)) {
    return (
      <LearningpathPage
        {...props}
        data={{ ...data, topicPath }}
        errors={errors}
      />
    );
  }
  return (
    <ArticlePage {...props} data={{ ...data, topicPath }} errors={errors} />
  );
};

ResourcePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

export default ResourcePage;
