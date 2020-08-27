/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import {
  SubjectShape,
  ResourceShape,
  LocationShape,
  ResourceTypeShape,
} from '../../shapes';
import { GraphqlErrorShape } from '../../graphqlShapes';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getContentType } from '../../util/getContentType';
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
  constructor(props) {
    super(props);
    this.state = {
      scripts: [],
    };
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
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

  static getDocumentTitle({ t, data }) {
    return `${data.subject?.name || ''} - ${data.resource?.article?.title ||
      ''}${t('htmlTitles.titleTemplate')}`;
  }

  componentDidMount() {
    const { data, locale } = this.props;
    const { resource } = data;
    const article = transformArticle(resource.article, locale);
    const scripts = getArticleScripts(article);
    this.setState({ scripts });
  }

  render() {
    const { data, locale, errors, skipToContentId, ndlaFilm } = this.props;
    const { resource, topic, resourceTypes, subject, topicPath } = data;
    const { scripts } = this.state;
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
      const error = errors?.find(e => e.path.includes('resource')) || {};
      return (
        <div>
          <ArticleErrorMessage
            subject={subject}
            topicPath={topicPath}
            status={error?.status === 404 ? 'error404' : 'error'}>
            {topic && (
              <Resources
                topic={topic}
                resourceTypes={resourceTypes}
                locale={locale}
                ndlaFilm={ndlaFilm}
              />
            )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const article = transformArticle(resource.article, locale);
    const resourceType = resource ? getContentType(resource) : null;

    return (
      <div>
        <ArticleHero
          ndlaFilm={ndlaFilm}
          subject={subject}
          topicPath={topicPath}
          resource={resource}
          resourceType={resourceType}
        />
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
          {article?.metaDescription && (
            <meta name="description" content={article.metaDescription} />
          )}
          {scripts.map(script => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
              defer={script.defer}
            />
          ))}

          <script type="application/ld+json">
            {JSON.stringify(getStructuredDataFromArticle(article))}
          </script>
        </Helmet>
        <SocialMediaMetadata
          title={`${subject?.name ? subject.name + ' - ' : ''}${article.title}`}
          trackableContent={article}
          description={article.metaDescription}
          locale={locale}
          image={article.metaImage}
        />
        <OneColumn>
          <Article
            id={skipToContentId}
            article={article}
            subject={subject}
            locale={locale}
            resourceType={resourceType}
            isResourceArticle
            {...getArticleProps(resource, topic)}>
            {topic && (
              <Resources
                topic={topic}
                resourceTypes={resourceTypes}
                locale={locale}
                ndlaFilm={ndlaFilm}
              />
            )}
          </Article>
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  data: PropTypes.shape({
    resource: ResourceShape,
    topic: PropTypes.shape({
      coreResources: PropTypes.arrayOf(ResourceTypeShape),
      supplementaryResources: PropTypes.arrayOf(ResourceTypeShape),
    }),
    topicPath: PropTypes.arrayOf(PropTypes.object),
    subject: SubjectShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: LocationShape,
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  skipToContentId: PropTypes.string,
  ndlaFilm: PropTypes.bool,
};

export default injectT(withTracker(ArticlePage));
