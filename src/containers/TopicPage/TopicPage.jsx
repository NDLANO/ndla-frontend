/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Hero, OneColumn, TopicBreadcrumb, LayoutItem, Article } from 'ndla-ui';
import Helmet from 'react-helmet';
import { injectT } from 'ndla-i18n';

import { actions, getTopicArticle, getTopic, getTopicPath } from './topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import TopicResources from './TopicResources';
import SubTopics from './SubTopics';
import { SubjectShape, ArticleShape, TopicShape } from '../../shapes';
import { toTopic } from '../../routeHelpers';

const TopicArticle = ({ article }) =>
  <article className="c-article">
    <LayoutItem layout="center">
      <h1>
        {article.title}
      </h1>
      <Article.Introduction introduction={article.introduction} />
      {/* <ArticleByline article={article} />*/}
    </LayoutItem>
    <LayoutItem layout="center">
      <Article.Content content={article.content} />
    </LayoutItem>
    <LayoutItem layout="center">
      {article.footNotes
        ? <Article.FootNotes footNotes={article.footNotes} />
        : null}
    </LayoutItem>
  </article>;

TopicArticle.propTypes = {
  article: ArticleShape.isRequired,
};

class TopicPage extends Component {
  componentWillMount() {
    const {
      match: { params },
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
      fetchSubjects,
    } = this.props;
    const { subjectId, topicId } = params;
    fetchTopicArticle({ subjectId, topicId });
    fetchTopicsWithIntroductions({ subjectId });
    fetchSubjects();
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
      article,
      t,
      topicPath,
      subject,
    } = this.props;
    const { subjectId } = params;
    if (!topic) {
      return null;
    }

    const metaDescription = article
      ? { name: 'description', content: article.metaDescription }
      : {};
    const title = article ? article.title : topic.name;
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
                {subject
                  ? <TopicBreadcrumb
                      toSubjects={() => '/'}
                      subjectsTitle={t('breadcrumb.subjectsLinkText')}
                      subject={subject}
                      topicPath={topicPath}
                      toTopic={toTopic}>
                      {/* {t('breadcrumb.label')}*/}
                    </TopicBreadcrumb>
                  : null}
              </section>
            </div>
          </OneColumn>
        </Hero>
        <OneColumn cssModifier="narrow">
          {article ? <TopicArticle article={article} /> : null}
        </OneColumn>
        <a href="/sflsdjfl">Not Found</a>
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
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), injectT)(
  TopicPage,
);
