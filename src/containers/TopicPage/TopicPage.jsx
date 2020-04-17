/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  SubjectHero,
  OneColumn,
  Breadcrumb,
  constants,
  NdlaFilmHero,
  FFHeroBadge,
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
import { getTopicPath } from '../../util/getTopicPath';
import { topicPageQuery } from '../../queries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { transformArticle } from '../../util/transformArticle';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../util/runQueries';
import config from '../../config';

const getTitle = (article, title) => {
  if (article) {
    return article.title;
  }
  return title || '';
};

const transformData = data => {
  const { subject, topic } = data;

  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  return { ...data, topicPath, topic };
};

const TopicPage = ({
  location,
  ndlaFilm,
  match,
  locale,
  t,
  skipToContentId,
}) => {
  const filterIds = getFiltersFromUrl(location);
  const { subjectId, topicId } = getUrnIdsFromProps({ ndlaFilm, match });
  const { data, loading, error } = useGraphQuery(topicPageQuery, {
    variables: { topicId, filterIds, subjectId },
  });

  if (loading) return null;

  if (!data) {
    return <DefaultErrorMessage />;
  }
  if (!data.topic) {
    return <NotFoundPage />;
  }

  const result = transformData(data);

  const {
    subject,
    topicPath,
    resourceTypes,
    topic: {
      name: topicTitle,
      article: topicArticle,
      supplementaryResources,
      coreResources,
    },
  } = result;

  const getDocumentTitle = () => {
    return `${subject?.name || ''} - ${getTitle(topicArticle, topicTitle)}${t(
      'htmlTitles.titleTemplate',
    )}`;
  };

  const hasArticleError =
    error?.graphQLErrors?.find(err => err.path.includes('article')) !==
    undefined;
  const article = transformArticle(topicArticle, locale);
  const scripts = getArticleScripts(article);
  const subtopics = subject
    ? subject.topics.filter(topic => topic.parent === topicId)
    : [];

  const Hero = ndlaFilm ? NdlaFilmHero : SubjectHero;
  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle()}`}</title>
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
          image={article.metaImage}
          title={`${subject?.name ? subject.name + ' - ' : ''}${article.title}`}
          trackableContent={article}
          locale={locale}
        />
      )}
      <Hero hasImage={article?.metaImage?.url}>
        {ndlaFilm && article?.metaImage?.url && (
          <div className="c-hero__background">
            <img src={article.metaImage.url} alt={article.metaImage.alt} />
          </div>
        )}
        <OneColumn>
          <div className="c-hero__content">
            <section>
              {config.isFFServer && <FFHeroBadge isNDLAFilm={ndlaFilm} />}
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
};

TopicPage.willTrackPageView = (trackPageView, props) => {
  if (props.loading || !props.data) {
    return;
  }
  trackPageView(props);
};

TopicPage.getDocumentTitle = ({ t, data: { topic, subject } }) => {
  return `${subject ? subject.name : ''} - ${getTitle(topic.article, topic)}${t(
    'htmlTitles.titleTemplate',
  )}`;
};

TopicPage.getDimensions = props => {
  const { subject, topicPath, topic } = props.data;
  return getAllDimensions(
    { subject, topicPath, article: topic.article },
    props.t('htmlTitles.topicPage'),
  );
};

TopicPage.defaultProps = {
  basename: '',
};

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
      id: PropTypes.string,
      name: PropTypes.string,
      parent: TopicShape,
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
  skipToContentId: PropTypes.string.isRequired,
  basename: PropTypes.string,
};

export default injectT(withTracker(TopicPage));
