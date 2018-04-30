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
import gql from 'graphql-tag';
import { getLocale } from '../Locale/localeSelectors';
import {
  ArticleShape,
  SubjectShape,
  ResourceTypeShape,
  GraphqlErrorShape,
} from '../../shapes';
import Article from '../../components/Article';
import TopicResources from '../TopicPage/TopicResources';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getAllDimensions } from '../../util/trackingUtil';
import { transformArticle } from '../../util/transformArticle';
import { getTopicPath } from '../../util/getTopicPath';
import { articleInfoFragment, topicInfoFragment } from '../../fragments';

const getTopicPathFromProps = props => {
  const { data: { subject } } = props;
  const { topicId } = getUrnIdsFromProps(props);
  return getTopicPath(subject.id, topicId, subject.topics);
};

export const query = gql`
  ${articleInfoFragment}
  ${topicInfoFragment}

  query ArticlePage($resourceId: String!, $subjectId: String!) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true) {
        ...TopicInfo
      }
    }
    resource(id: $resourceId) {
      name
      contentUri
      article {
        ...ArticleInfo
      }
      resourceTypes {
        id
        name
      }
    }
  }
`;

class ArticlePage extends Component {
  static async getInitialProps(ctx) {
    const { client } = ctx;
    const { subjectId, resourceId } = getUrnIdsFromProps(ctx);

    return client.query({
      errorPolicy: 'all',
      query,
      variables: {
        subjectId,
        resourceId,
      },
    });
  }

  static getDocumentTitle({ t, data: { resource: { article, subject } } }) {
    return `${subject ? subject.name : ''} - ${article.title}${t(
      'htmlTitles.titleTemplate',
    )}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { data, loading } = currentProps;
    if (!data || !data.resource || !data.subject || loading) {
      return;
    }
    const topicPath = getTopicPathFromProps(currentProps);
    if (data.resource && topicPath && topicPath.length > 0 && data.subject) {
      trackPageView(currentProps);
    }
  }

  static getDimensions(props) {
    const articleProps = getArticleProps(props.data.resource);
    const { data: { resource: { article }, subject } } = props;
    const topicPath = getTopicPathFromProps(props);
    return getAllDimensions(
      { article, subject, topicPath },
      articleProps.label,
      true,
    );
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

  render() {
    const { data, locale, errors } = this.props;
    if (!data || !data.subject) {
      return null;
    }

    const { resource, subject } = data;
    const { topicId } = getUrnIdsFromProps(this.props);
    const topicPath = getTopicPathFromProps(this.props);

    if (resource === null) {
      const error = errors.find(e => e.path.includes('resource'));
      return (
        <div>
          <ArticleHero subject={subject} topicPath={topicPath} resource={{}} />
          <ArticleErrorMessage
            subject={subject}
            topicPath={topicPath}
            status={
              error.status && error.status === 404 ? 'error404' : 'error'
            }>
            {subject &&
              topicId && (
                <TopicResources subjectId={subject.id} topicId={topicId} />
              )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const article = transformArticle(resource.article);
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
            {...getArticleProps(resource)}>
            {subject &&
              topicId && (
                <TopicResources subjectId={subject.id} topicId={topicId} />
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
    subject: SubjectShape,
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(connect(mapStateToProps), injectT, withTracker)(
  ArticlePage,
);
