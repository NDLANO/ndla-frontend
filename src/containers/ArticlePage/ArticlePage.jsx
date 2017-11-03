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
import Helmet from 'react-helmet';
import { OneColumn, ErrorMessage } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { actions, hasFetchArticleFailed, getArticle } from './article';
import { getTopicPath, actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, TopicShape } from '../../shapes';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import config from '../../config';
import connectSSR from '../../components/connectSSR';

const assets = __CLIENT__ // eslint-disable-line no-nested-ternary
  ? window.assets
  : config.isProduction
    ? require('../../../assets/assets') // eslint-disable-line import/no-unresolved
    : require('../../../server/developmentAssets');

class ArticlePage extends Component {
  static getInitialProps(ctx) {
    const {
      history,
      fetchArticle,
      fetchTopics,
      fetchSubjects,
      match: { params },
    } = ctx;
    const { articleId, subjectId, resourceId } = params;
    fetchArticle({ articleId, resourceId, history });
    if (subjectId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }
  }

  componentDidMount() {
    ArticlePage.getInitialProps(this.props);
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
    const { article, subject, hasFailed, topicPath, locale, t } = this.props;

    if (hasFailed) {
      return (
        <div>
          <ArticleHero subject={subject} topicPath={topicPath} article={{}} />
          <OneColumn>
            <article className="c-article">
              <ErrorMessage
                messages={{
                  title: t('errorMessage.title'),
                  description: t('articlePage.errorDescription'),
                  back: t('errorMessage.back'),
                  goToFrontPage: t('errorMessage.goToFrontPage'),
                }}
              />
            </article>
          </OneColumn>
        </div>
      );
    }

    if (!article) {
      return null;
    }

    const scripts = article.requiredLibraries
      ? article.requiredLibraries.map(lib => ({
          src: lib.url,
          type: lib.mediaType,
        }))
      : [];
    if (article.content.indexOf('<math') > -1) {
      scripts.push({
        async: true,
        src: `https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=/assets/${assets[
          'mathjaxConfig.js'
        ]}`,
        type: 'text/javascript',
      });
    }

    const metaDescription = article.metaDescription
      ? { name: 'description', content: article.metaDescription }
      : {};
    return (
      <div>
        <Helmet
          title={`NDLA | ${article.title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        <ArticleHero
          subject={subject}
          topicPath={topicPath}
          article={article}
        />
        <OneColumn>
          <Article article={article} locale={locale} />
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
      resourceId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  article: ArticleShape,
  hasFailed: PropTypes.bool.isRequired,
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
  fetchTopics: topicActions.fetchTopics,
};

const makeMapStateToProps = (_, ownProps) => {
  const { articleId, subjectId, topicId } = ownProps.match.params;
  const getArticleSelector = getArticle(articleId);
  const getTopicPathSelector =
    subjectId && topicId ? getTopicPath(subjectId, topicId) : () => undefined;
  const getSubjectByIdSelector = subjectId
    ? getSubjectById(subjectId)
    : () => undefined;
  return state => ({
    article: getArticleSelector(state),
    hasFailed: hasFetchArticleFailed(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    locale: getLocale(state),
  });
};

export default compose(
  connectSSR(makeMapStateToProps, mapDispatchToProps),
  injectT,
)(ArticlePage);
