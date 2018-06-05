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
import {
  actions,
  getTopicArticle,
  getTopic,
  getTopicPath,
  getFetchTopicsStatus,
  getFetchTopicArticleStatus,
} from './topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import SubTopics from './SubTopics';
import {
  SubjectShape,
  ArticleShape,
  TopicShape,
  ResourceTypeShape,
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
import { topicResourcesQuery, resourceTypesQuery } from '../../queries';

const getTitle = (article, topic) => {
  if (article) {
    return article.title;
  } else if (topic) {
    return topic.name;
  }
  return '';
};

class TopicPage extends Component {
  static async getInitialProps(ctx) {
    const {
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
      fetchSubjects,
      client,
    } = ctx;
    const { subjectId, topicId } = getUrnIdsFromProps(ctx);
    fetchTopicArticle({ subjectId, topicId });
    fetchTopicsWithIntroductions({ subjectId });
    fetchSubjects();
    try {
      return runQueries(client, [
        { query: topicResourcesQuery, variables: { topicId } },
        { query: resourceTypesQuery },
      ]);
    } catch (e) {
      handleError(e);
      return null;
    }
  }

  static getDocumentTitle({ t, article, topic, subject }) {
    return `${subject ? subject.name : ''} - ${getTitle(article, topic)}${t(
      'htmlTitles.titleTemplate',
    )}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { topic, topicPath, subject, article } = currentProps;
    if (
      article &&
      article.id &&
      topic &&
      topic.id &&
      topicPath &&
      topicPath.length > 0 &&
      subject
    ) {
      trackPageView(currentProps);
    }
  }

  static getDimensions(props) {
    return getAllDimensions(props, props.t('htmlTitles.topicPage'));
  }

  componentWillReceiveProps(nextProps) {
    const { fetchTopicArticle, fetchTopicsWithIntroductions } = this.props;
    const { subjectId, topicId } = getUrnIdsFromProps(this.props);
    const { topicId: nextTopicId } = getUrnIdsFromProps(nextProps);

    if (nextTopicId !== topicId) {
      fetchTopicArticle({
        subjectId,
        topicId: nextTopicId,
      });
      fetchTopicsWithIntroductions({ subjectId });
    }
  }

  render() {
    const {
      topic,
      locale,
      article,
      t,
      topicPath,
      fetchTopicsStatus,
      fetchTopicArticleStatus,
      subject,
      loading,
      data,
    } = this.props;

    const { subjectId } = getUrnIdsFromProps(this.props);
    const scripts = getArticleScripts(article);

    if (loading) {
      return null;
    }

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
                      subject,
                      topicPath,
                      t('breadcrumb.toFrontpage'),
                    )}
                  />
                ) : null}
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        {(fetchTopicsStatus === 'error' ||
          fetchTopicArticleStatus === 'error') && (
          <TopicPageErrorMessage
            t={t}
            fetchTopicsFailed={fetchTopicsStatus === 'error'}
          />
        )}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            label={t('topicPage.topic')}
            contentType={constants.contentTypes.SUBJECT}>
            {topic ? (
              <Fragment>
                <SubTopics
                  subjectId={subjectId}
                  topic={topic}
                  topicPath={topicPath}
                />
                {data &&
                  data.resourceTypes &&
                  data.topic && (
                    <Resources
                      resourceTypes={data.resourceTypes}
                      supplementaryResources={data.topic.supplementaryResources}
                      coreResources={data.topic.coreResources}
                    />
                  )}
              </Fragment>
            ) : null}
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
  fetchSubjects: PropTypes.func.isRequired,
  fetchTopicArticle: PropTypes.func.isRequired,
  fetchTopicsWithIntroductions: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  fetchTopicArticleStatus: PropTypes.string.isRequired,
  fetchTopicsStatus: PropTypes.string.isRequired,
  topic: TopicShape,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  article: ArticleShape,
  data: PropTypes.shape({
    topic: PropTypes.shape({
      coreResources: PropTypes.arrayOf(ResourceTypeShape),
      supplementaryResources: PropTypes.arrayOf(ResourceTypeShape),
    }),
  }),
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  loading: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
  fetchTopicsWithIntroductions: actions.fetchTopicsWithIntroductions,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = getUrnIdsFromProps(ownProps);
  const getTopicSelector = getTopic(subjectId, topicId);
  const getTopicArticleSelector = getTopicArticle(subjectId, topicId);
  const getTopicPathSelector = getTopicPath(subjectId, topicId);
  const getSubjectByIdSelector = getSubjectById(subjectId);
  return {
    topic: getTopicSelector(state),
    article: getTopicArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    fetchTopicArticleStatus: getFetchTopicArticleStatus(state),
    fetchTopicsStatus: getFetchTopicsStatus(state),
    locale: getLocale(state),
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
  withTracker,
)(TopicPage);
