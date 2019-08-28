/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ArticleShape,
  SubjectShape,
  ResourceTypeShape,
  TopicShape,
} from '../../shapes';
import { GraphqlErrorShape } from '../../graphqlShapes';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import {
  subjectTopicsQuery,
  resourceTypesQuery,
  topicResourcesQuery,
  resourceQuery,
} from '../../queries';
import { runQueries } from '../../util/runQueries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { isLearningPathResource } from '../Resources/resourceHelpers';
import LearningpathPage from '../LearningpathPage/LearningpathPage';
import ArticlePage from '../ArticlePage/ArticlePage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const transformData = data => {
  const { subject, topic } = data;
  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  return { ...data, topicPath };
};

class ResourcePage extends Component {
  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  static async getInitialProps(ctx) {
    const { client, location } = ctx;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(ctx);
    const filterIds = getFiltersFromUrl(location);
    const response = await runQueries(client, [
      {
        query: subjectTopicsQuery,
        variables: { subjectId },
      },
      {
        query: topicResourcesQuery,
        variables: { topicId, filterIds, subjectId },
      },
      {
        query: resourceQuery,
        variables: { resourceId, filterIds, subjectId },
      },
      {
        query: resourceTypesQuery,
      },
    ]);
    return {
      ...response,
      data: transformData(response.data),
    };
  }

  render() {
    const { data, loading, errors } = this.props;
    if (loading) {
      return null;
    }

    if (errors && errors.filter(error => error.status === 404).length > 0) {
      return <NotFoundPage />;
    }

    if (!data) {
      return <DefaultErrorMessage />;
    }
    if (isLearningPathResource(data.resource)) {
      return <LearningpathPage {...this.props} />;
    }
    return <ArticlePage {...this.props} />;
  }
}

ResourcePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  data: PropTypes.shape({
    resource: PropTypes.shape({
      article: ArticleShape,
      resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
    }),
    topic: PropTypes.shape({
      coreResources: PropTypes.arrayOf(ResourceTypeShape),
      supplementaryResources: PropTypes.arrayOf(ResourceTypeShape),
    }),
    topicPath: PropTypes.arrayOf(TopicShape),
    subject: SubjectShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string,
};

export default ResourcePage;
