/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { SubjectHero, OneColumn, Breadcrumb, constants } from 'ndla-ui';
import Helmet from 'react-helmet';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import connectSSR from '../../components/connectSSR';
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
import { getLocale } from '../Locale/localeSelectors';
import { TopicPageErrorMessage } from './components/TopicsPageErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getAllDimensions } from '../../util/trackingUtil';
import Resources from '../Resources/Resources';
import handleError from '../../util/handleError';
import { runQueries } from '../../util/runQueries';
import { getTopicPath } from '../../util/getTopicPath';
import {
  topicResourcesQuery,
  resourceTypesQuery,
  topicQuery,
  subjectTopicsQuery,
} from '../../queries';
import { getFiltersFromUrl } from '../../util/filterHelper';

const getTitle = (article, topic) => {
  if (article) {
    return article.title;
  } else if (topic) {
    return topic.name;
  }
  return '';
};

const proccessData = (subjectId, topicId, data) => {
  const { subject } = data;

  const topicPath = getTopicPath(subject.id, topicId, subject.topics);
  return { ...data, topicPath };
};

class TopicPage extends Component {
  static async getInitialProps(ctx) {
    const { client, location } = ctx;
    const { subjectId, topicId } = getUrnIdsFromProps(ctx);
    const filterIds = getFiltersFromUrl(location);
    try {
      const response = await runQueries(client, [
        { query: topicResourcesQuery, variables: { topicId, filterIds } },
        { query: topicQuery, variables: { topicId, filterIds } },
        {
          query: subjectTopicsQuery,
          variables: { subjectId, filterIds },
        },
        { query: resourceTypesQuery },
      ]);
      return {
        ...response,
        data: proccessData(subjectId, topicId, response.data),
      };
    } catch (e) {
      handleError(e);
      return null;
    }
  }

  static getDocumentTitle({ t, data: { topic, subject } }) {
    return `${subject ? subject.name : ''} - ${getTitle(
      topic.article,
      topic,
    )}${t('htmlTitles.titleTemplate')}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { data, loading } = currentProps;
    if (loading) {
      return;
    }

    const { subject, topicPath, topic } = data;
    if (
      topic &&
      topic.article &&
      topicPath &&
      topicPath.length > 0 &&
      subject
    ) {
      trackPageView(currentProps);
    }
  }

  static getDimensions(props) {
    const { subject, topicPath, topic } = props.data;
    return getAllDimensions(
      { subject, topicPath, article: topic.article },
      props.t('htmlTitles.topicPage'),
    );
  }

  render() {
    const { locale, t, loading, data, location, errors } = this.props;

    const { subjectId } = getUrnIdsFromProps(this.props);

    if (loading || !data) {
      return null;
    }

    const {
      subject,
      topicPath,
      resourceTypes,
      topic: { article, subtopics, supplementaryResources, coreResources },
    } = data;

    const hasArticleError =
      errors.find(e => e.path.includes('article')) !== undefined;
    const scripts = getArticleScripts(article);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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

        <SubjectHero>
          <OneColumn>
            <div className="c-hero__content">
              <section>
                {subject ? (
                  <Breadcrumb
                    items={toBreadcrumbItems(
                      t('breadcrumb.toFrontpage'),
                      subject,
                      topicPath,
                      undefined,
                      getFiltersFromUrl(location),
                    )}
                  />
                ) : null}
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        {hasArticleError && <TopicPageErrorMessage t={t} />}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            label={t('topicPage.topic')}
            contentType={constants.contentTypes.SUBJECT}>
            <Fragment>
              <SubTopics
                subjectId={subjectId}
                subtopics={subtopics}
                topicPath={topicPath}
              />
              <Resources
                resourceTypes={resourceTypes}
                supplementaryResources={supplementaryResources}
                coreResources={coreResources}
              />
            </Fragment>
          </Article>
        </OneColumn>
      </div>
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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(connectSSR(mapStateToProps), injectT, withTracker)(
  TopicPage,
);
