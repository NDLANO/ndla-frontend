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
import {
  SubjectHero,
  OneColumn,
  Breadcrumb,
  constants,
  NdlaFilmHero,
} from '@ndla/ui';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import SubTopics from './SubTopics';
import {
  SubjectShape,
  ArticleShape,
  TopicShape,
  ResourceTypeShape,
  LocationShape,
  ResourceShape,
} from '../../shapes';

import { GraphqlErrorShape } from '../../graphqlShapes';

import { toBreadcrumbItems, getUrnIdsFromProps } from '../../routeHelpers';
import Article from '../../components/Article';
import { TopicPageErrorMessage } from './components/TopicsPageErrorMessage';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getAllDimensions } from '../../util/trackingUtil';
import Resources from '../Resources/Resources';
import { runQueries } from '../../util/runQueries';
import { getTopicPath } from '../../util/getTopicPath';
import {
  resourceTypesQuery,
  topicQuery,
  subjectTopicsQuery,
} from '../../queries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { transformArticle } from '../../util/transformArticle';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getTitle = (article, topic) => {
  if (article) {
    return article.title;
  }
  if (topic) {
    return topic.name;
  }
  return '';
};

const transformData = (data, locale) => {
  const { subject, topic } = data;

  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  return { ...data, topicPath, topic };
};

class TopicPage extends Component {
  static willTrackPageView(trackPageView, props) {
    if (props.loading || !props.data) {
      return;
    }
    trackPageView(props);
  }

  static getDocumentTitle({ t, data: { topic, subject } }) {
    return `${subject ? subject.name : ''} - ${getTitle(
      topic.article,
      topic,
    )}${t('htmlTitles.titleTemplate')}`;
  }

  static async getInitialProps(ctx) {
    const { client, location } = ctx;
    const { subjectId, topicId } = getUrnIdsFromProps(ctx);
    const filterIds = getFiltersFromUrl(location);

    const response = await runQueries(client, [
      { query: topicQuery, variables: { topicId, filterIds, subjectId } },
      {
        query: subjectTopicsQuery,
        variables: { subjectId, filterIds },
      },
      { query: resourceTypesQuery },
    ]);
    return {
      ...response,
      data: transformData(response.data, ctx.locale),
    };
  }

  static getDimensions(props) {
    const { subject, topicPath, topic } = props.data;
    return getAllDimensions(
      { subject, topicPath, article: topic.article },
      props.t('htmlTitles.topicPage'),
    );
  }

  render() {
    const {
      locale,
      t,
      loading,
      data,
      location,
      errors,
      ndlaFilm,
      skipToContentId,
    } = this.props;
    const { subjectId } = getUrnIdsFromProps(this.props);

    if (loading) {
      return null;
    }

    if (!data) {
      return <DefaultErrorMessage />;
    }

    const {
      subject,
      topicPath,
      resourceTypes,
      topic: {
        id: topicId,
        name: topicTitle,
        article: topicArticle,
        supplementaryResources,
        coreResources,
      },
    } = data;

    const hasArticleError =
      errors && errors.find(e => e.path.includes('article')) !== undefined;
    const article = transformArticle(topicArticle, locale);
    const scripts = getArticleScripts(article);
    const subtopics = subject
      ? subject.topics.filter(topic => topic.parent === topicId)
      : [];

    const Hero = ndlaFilm ? NdlaFilmHero : SubjectHero;

    const metaImage =
      article.metaData &&
      article.metaData.images &&
      article.metaData.images.length > 0
        ? article.metaData.images[0]
        : undefined;
    return (
      <>
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
        {article && (
          <SocialMediaMetadata
            description={article.metaDescription}
            image={metaImage}
            title={article.title}
            locale={locale}
          />
        )}
        <Hero hasImage={article && article.metaImage && article.metaImage.url}>
          {ndlaFilm && article && article.metaImage && article.metaImage.url && (
            <div className="c-hero__background">
              <img src={article.metaImage.url} alt={article.metaImage.alt} />
            </div>
          )}
          <OneColumn>
            <div className="c-hero__content">
              <section>
                {subject ? (
                  <Breadcrumb
                    items={toBreadcrumbItems(
                      t('breadcrumb.toFrontpage'),
                      [subject, ...topicPath],
                      getFiltersFromUrl(location),
                    )}
                  />
                ) : null}
              </section>
            </div>
          </OneColumn>
        </Hero>
        {hasArticleError && <TopicPageErrorMessage t={t} />}
        <OneColumn>
          <Article
            id={skipToContentId}
            isTopicArticle
            article={article}
            locale={locale}
            label={t('topicPage.topic')}
            contentType={constants.contentTypes.SUBJECT}>
            <>
              <SubTopics
                topicTitle={topicTitle}
                subjectId={subjectId}
                subtopics={subtopics}
                topicPath={topicPath}
              />
              <Resources
                title={topicTitle || ''}
                resourceTypes={resourceTypes}
                coreResources={coreResources}
                supplementaryResources={supplementaryResources}
                locale={locale}
              />
            </>
          </Article>
        </OneColumn>
      </>
    );
  }
}

TopicPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  data: PropTypes.shape({
    subject: SubjectShape,
    topic: PropTypes.shape({
      article: ArticleShape,
      subtopics: PropTypes.arrayOf(TopicShape),
      coreResources: PropTypes.arrayOf(ResourceShape),
      supplementaryResources: PropTypes.arrayOf(ResourceShape),
    }),
    topicPath: PropTypes.arrayOf(TopicShape),
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  loading: PropTypes.bool.isRequired,
  location: LocationShape,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string,
};

export default compose(
  injectT,
  withTracker,
)(TopicPage);
