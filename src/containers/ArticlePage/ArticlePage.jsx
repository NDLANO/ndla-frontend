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
import { actions, getFetchStatus, getArticle } from './article';
import { getTopicPath, actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, TopicShape } from '../../shapes';
import Article from '../../components/Article';
import ArticleHero from './components/ArticleHero';
import connectSSR from '../../components/connectSSR';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';

class ArticlePage extends Component {
  static getInitialProps(ctx) {
    const { fetchArticle, fetchTopics, fetchSubjects, match: { params } } = ctx;
    const { articleId, subjectId, plainResourceId } = params;
    const resourceId = plainResourceId
      ? `urn:resource:${plainResourceId}`
      : undefined;

    fetchArticle({ articleId, resourceId });
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
    const { article, subject, status, topicPath, locale, t } = this.props;

    if (status === 'error' || status === 'error404') {
      return (
        <div>
          <ArticleHero subject={subject} topicPath={topicPath} article={{}} />
          <OneColumn>
            <article className="c-article">
              <ErrorMessage
                messages={{
                  title: t('errorMessage.title'),
                  description:
                    status === 'error404'
                      ? t('articlePage.error404Description')
                      : t('articlePage.errorDescription'),
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

    const scripts = getArticleScripts(article);

    return (
      <div>
        <Helmet>
          <title>{`NDLA | ${article.title}`}</title>
          {article.metaDescription && (
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
  article: ArticleShape,
  status: PropTypes.string.isRequired,
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
    status: getFetchStatus(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    locale: getLocale(state),
  });
};

export default compose(
  connectSSR(makeMapStateToProps, mapDispatchToProps),
  injectT,
)(ArticlePage);
