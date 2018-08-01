/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OneColumn } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, ResourceTypeShape } from '../../shapes';
import { GraphqlErrorShape } from '../../graphqlShapes';
import Article from '../../components/Article';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getAllDimensions } from '../../util/trackingUtil';
import { transformArticle } from '../../util/transformArticle';
import { getTopicPath } from '../../util/getTopicPath';
import {
  subjectTopicsQuery,
  resourceTypesQuery,
  topicResourcesQuery,
  resourceQuery,
} from '../../queries';
import Resources from '../Resources/Resources';
import { runQueries } from '../../util/runQueries';
import { getFiltersFromUrl } from '../../util/filterHelper';

const transformData = data => {
  const { subject, topic } = data;

  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  return { ...data, topicPath };
};

class ArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
  }

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

  static getDimensions(props) {
    const articleProps = getArticleProps(props.data.resource);
    const {
      data: {
        resource: { article },
        subject,
        topicPath,
      },
    } = props;
    return getAllDimensions(
      { article, subject, topicPath },
      articleProps.label,
      true,
    );
  }

  static getDocumentTitle({
    t,
    data: {
      resource: { article },
      subject,
    },
  }) {
    return `${subject ? subject.name : ''} - ${article ? article.title : ''}${t(
      'htmlTitles.titleTemplate',
    )}`;
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
        variables: { topicId, filterIds },
      },
      {
        query: resourceQuery,
        variables: { resourceId },
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
    const { data, locale, errors, loading } = this.props;
    if (loading) {
      return null;
    }

    if (!data) {
      return <DefaultErrorMessage />;
    }

    const { resource, topic, resourceTypes, subject, topicPath } = data;
    const topicTitle =
      topicPath.length > 0 ? topicPath[topicPath.length - 1].name : '';

    if (resource === null || resource.article === null) {
      const error = errors ? errors.find(e => e.path.includes('resource')) : {};
      return (
        <div>
          <ArticleHero subject={subject} topicPath={topicPath} resource={{}} />
          <ArticleErrorMessage
            subject={subject}
            topicPath={topicPath}
            status={
              error.status && error.status === 404 ? 'error404' : 'error'
            }>
            {topic && (
              <Resources
                title={topicTitle}
                resourceTypes={resourceTypes}
                supplementaryResources={topic.supplementaryResources}
                coreResources={topic.coreResources}
              />
            )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const article = transformArticle(resource.article, locale);
    const scripts = getArticleScripts(article);

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
          {article &&
            article.metaDescription && (
              <meta name="description" content={article.metaDescription} />
            )}

          {scripts.map(script => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
            />
          ))}

          <script type="application/ld+json">
            {JSON.stringify(getStructuredDataFromArticle(article))}
          </script>
        </Helmet>
        {resource && (
          <ArticleHero
            subject={subject}
            topicPath={topicPath}
            resource={resource}
          />
        )}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            {...getArticleProps(resource, topic)}>
            {topic && (
              <Resources
                title={topicTitle}
                resourceTypes={resourceTypes}
                supplementaryResources={topic.supplementaryResources}
                coreResources={topic.coreResources}
              />
            )}
          </Article>
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
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
    subject: SubjectShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(
  connect(mapStateToProps),
  injectT,
  withTracker,
)(ArticlePage);
