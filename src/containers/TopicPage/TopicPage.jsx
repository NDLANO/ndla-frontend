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
import { Hero, OneColumn, Breadcrumb, ErrorMessage } from 'ndla-ui';
import Helmet from 'react-helmet';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import {
  actions,
  getTopicArticle,
  getTopic,
  getTopicPath,
  hasFetchTopicsFailed,
  hasFetchTopicArticleFailed,
} from './topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import TopicResources from './TopicResources';
import SubTopics from './SubTopics';
import { SubjectShape, ArticleShape, TopicShape } from '../../shapes';
import { toTopic } from '../../routeHelpers';
import Article from '../../components/Article';
import { getLocale } from '../Locale/localeSelectors';

const getTitle = (article, topic) => {
  if (article) {
    return article.title;
  } else if (topic) {
    return topic.name;
  }
  return '';
};

class TopicPage extends Component {
  static getInitialProps(ctx) {
    const {
      match: { params },
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
      fetchSubjects,
    } = ctx;
    const { subjectId, topicId } = params;
    fetchTopicArticle({ subjectId, topicId });
    fetchTopicsWithIntroductions({ subjectId });
    fetchSubjects();
  }

  componentDidMount() {
    TopicPage.getInitialProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
    } = this.props;
    const { subjectId, topicId } = params;

    if (nextProps.match.params.topicId !== topicId) {
      fetchTopicArticle({
        subjectId,
        topicId: nextProps.match.params.topicId,
      });
      fetchTopicsWithIntroductions({ subjectId });
    }
  }

  render() {
    const {
      match: { params },
      topic,
      locale,
      article,
      t,
      topicPath,
      fetchTopicsFailed,
      fetchTopicArticleFailed,
      subject,
    } = this.props;
    const { subjectId } = params;

    const metaDescription = article
      ? { name: 'description', content: article.metaDescription }
      : {};
    const title = getTitle(article, topic);

    const scripts = article
      ? article.requiredLibraries.map(lib => ({
          src: lib.url,
          type: lib.mediaType,
        }))
      : [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Helmet
          title={`NDLA | ${title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        <Hero>
          <OneColumn cssModifier="narrow">
            <div className="c-hero__content">
              <section>
                {subject ? (
                  <Breadcrumb
                    toSubjects={() => '/'}
                    subjectsTitle={t('breadcrumb.subjectsLinkText')}
                    subject={subject}
                    topicPath={topicPath}
                    toTopic={toTopic}
                  />
                ) : null}
              </section>
            </div>
          </OneColumn>
        </Hero>
        {(fetchTopicsFailed || fetchTopicArticleFailed) && (
          <OneColumn cssModifier="narrow">
            <div className="c-article">
              <ErrorMessage
                messages={{
                  title: t('errorMessage.title'),
                  description: fetchTopicsFailed
                    ? t('topicPage.topicErrorDescription')
                    : t('topicPage.articleErrorDescription'),
                  back: fetchTopicsFailed ? t('errorMessage.back') : undefined,
                  goToFrontPage: fetchTopicsFailed
                    ? t('errorMessage.goToFrontPage')
                    : undefined,
                }}
              />
            </div>
          </OneColumn>
        )}
        <OneColumn cssModifier="narrow">
          {article ? <Article article={article} locale={locale} /> : null}
        </OneColumn>
        {topic ? (
          <OneColumn cssModifier="narrow">
            <SubTopics
              subjectId={subjectId}
              topic={topic}
              topicPath={topicPath}
            />
            <TopicResources
              subjectId={subjectId}
              topic={topic}
              topicPath={topicPath}
            />
          </OneColumn>
        ) : null}
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
  fetchTopicsFailed: PropTypes.bool.isRequired,
  fetchTopicArticleFailed: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  topic: TopicShape,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  article: ArticleShape,
};

const mapDispatchToProps = {
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
  fetchTopicsWithIntroductions: actions.fetchTopicsWithIntroductions,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.match.params;
  const getTopicSelector = getTopic(subjectId, topicId);
  const getTopicArticleSelector = getTopicArticle(subjectId, topicId);
  const getTopicPathSelector = getTopicPath(subjectId, topicId);
  const getSubjectByIdSelector = getSubjectById(subjectId);
  return {
    topic: getTopicSelector(state),
    article: getTopicArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    fetchTopicArticleFailed: hasFetchTopicArticleFailed(state),
    fetchTopicsFailed: hasFetchTopicsFailed(state),
    locale: getLocale(state),
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicPage);
