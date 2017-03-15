/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OneColumn, TopicBreadcrumb, Hero } from 'ndla-ui';
import * as actions from './articleActions';
import * as topicActions from '../TopicPage/topicActions';
import { getTopicPath } from '../TopicPage/topicSelectors';
import { getSubjectById } from '../SubjectPage/subjectSelectors';
import * as subjectActions from '../SubjectPage/subjectActions';
import { getArticle } from './articleSelectors';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, TopicShape } from '../../shapes';
import { toTopic } from '../../routes';
import Article from './components/Article';

class ArticlePage extends Component {
  componentWillMount() {
    const { fetchArticle, fetchTopics, fetchSubjects, params: { articleId, subjectId } } = this.props;
    fetchArticle(articleId);
    if (subjectId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }
  }

  render() {
    const { article, subject, topicPath, locale } = this.props;
    if (!article) {
      return null;
    }
    const scripts = article.requiredLibraries ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    const metaDescription = article.metaDescription ? { name: 'description', content: article.metaDescription } : {};
    return (
      <div>
        <Hero white><span /></Hero>
        <OneColumn cssModifier="narrow">
          <Helmet
            title={`NDLA | ${article.title}`}
            meta={[metaDescription]}
            script={scripts}
          />
          <section className="c-article-content">
            { subject ? <TopicBreadcrumb toSubjects={() => '/'} subjectsTitle="Fag" subject={subject} topicPath={topicPath} toTopic={toTopic}><strong>Du er her:</strong></TopicBreadcrumb> : null }
            <Article article={article} locale={locale} />
          </section>
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  params: PropTypes.shape({
    articleId: PropTypes.string.isRequired,
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  fetchArticle: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopics: topicActions.fetchTopicArticle,
};

const makeMapStateToProps = (_, ownProps) => {
  const { articleId, subjectId, topicId } = ownProps.params;
  const getArticleSelector = getArticle(articleId);
  const getTopicPathSelector = subjectId && topicId ? getTopicPath(subjectId, topicId) : () => undefined;
  const getSubjectByIdSelector = subjectId ? getSubjectById(subjectId) : () => undefined;
  return state => ({
    article: getArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    locale: getLocale(state),
  });
};


export default connect(makeMapStateToProps, mapDispatchToProps)(ArticlePage);
