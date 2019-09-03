/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Helmet from 'react-helmet';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { ArticleShape, SubjectShape, ResourceTypeShape } from '../../shapes';
import { GraphqlErrorShape } from '../../graphqlShapes';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import { transformArticle } from '../../util/transformArticle';
import Resources from '../Resources/Resources';
import {
  isLearningPathResource,
  getLearningPathUrlFromResource,
} from '../Resources/resourceHelpers';
import { RedirectExternal, Status } from '../../components';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

class ArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
  }

  static getDimensions(props) {
    const { resource } = props.data;
    const articleProps = getArticleProps(resource);
    return getAllDimensions(resource, articleProps.label, true);
  }

  static getDocumentTitle({ t, data }) {
    return `${data.subject ? data.subject.name : ''} - ${
      data.resource && data.resource.article ? data.resource.article.title : ''
    }${t('htmlTitles.titleTemplate')}`;
  }

  render() {
    const { data, locale, errors, ndlaFilm, skipToContentId } = this.props;

    const { resource, topic, resourceTypes, subject, topicPath } = data;
    const topicTitle =
      topicPath.length > 0 ? topicPath[topicPath.length - 1].name : '';
    if (isLearningPathResource(resource)) {
      const url = getLearningPathUrlFromResource(resource);
      return (
        <Status code={307}>
          <RedirectExternal to={url} />
        </Status>
      );
    }

    if (resource === null || resource.article === null) {
      const error = errors ? errors.find(e => e.path.includes('resource')) : {};
      return (
        <div>
          <ArticleHero
            ndlaFilm={ndlaFilm}
            subject={subject}
            topicPath={topicPath}
            resource={resource}
          />
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
                locale={locale}
              />
            )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const article = transformArticle(resource.article, locale);
    const scripts = getArticleScripts(article);

    const metaImage =
      article.metaData &&
      article.metaData.images &&
      article.metaData.images.length > 0
        ? article.metaData.images[0]
        : undefined;
    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
          {article && article.metaDescription && (
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
        <SocialMediaMetadata
          title={`${subject && subject.name ? subject.name + ' - ' : ''}${
            article.title
          }`}
          trackableContent={article}
          description={article.metaDescription}
          locale={locale}
          image={metaImage}
        />
        {resource && (
          <ArticleHero
            ndlaFilm={ndlaFilm}
            metaImage={resource.article.metaImage}
            subject={subject}
            topicPath={topicPath}
            resource={resource}
          />
        )}
        <OneColumn>
          <Article
            id={skipToContentId}
            article={article}
            locale={locale}
            {...getArticleProps(resource, topic)}>
            {topic && (
              <Resources
                title={topicTitle}
                resourceTypes={resourceTypes}
                supplementaryResources={topic.supplementaryResources}
                coreResources={topic.coreResources}
                locale={locale}
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
    topicPath: PropTypes.arrayOf(PropTypes.string),
    subject: SubjectShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string,
};

export default compose(
  injectT,
  withTracker,
)(ArticlePage);
