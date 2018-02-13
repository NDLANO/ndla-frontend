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
import { OneColumn } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withTracker } from 'ndla-tracker';
import { actions, getFetchStatus, getArticle } from './article';
import { getTopicPath, actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, TopicShape } from '../../shapes';
import Article from '../../components/Article';
import TopicResources from '../TopicPage/TopicResources';
import ArticleHero from './components/ArticleHero';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import connectSSR from '../../components/connectSSR';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getAllDimensions } from '../../util/trackingUtil';

const getTitle = article => (article ? article.title : '');

class ArticlePage extends Component {
  static getInitialProps(ctx) {
    const { fetchArticle, fetchTopics, fetchSubjects } = ctx;
    const { subjectId, resourceId } = getUrnIdsFromProps(ctx);

    fetchArticle({ resourceId });
    if (subjectId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }
  }

  static getDocumentTitle({ t, article, subject }) {
    return `${subject ? subject.name : ''} - ${getTitle(article)}${t(
      'htmlTitles.titleTemplate',
    )}`;
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { topicPath, subject, article } = currentProps;
    if (article && article.id && topicPath && subject) {
      trackPageView(currentProps);
    }
  }

  static getDimensions(props) {
    const articleProps = getArticleProps(props.article);
    return getAllDimensions(props, articleProps.label, true);
  }

  componentDidMount() {
    ArticlePage.getInitialProps(this.props);
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { resourceId } = getUrnIdsFromProps(this.props);
    const { resourceId: nextResourceId } = getUrnIdsFromProps(nextProps);

    if (resourceId !== nextResourceId) {
      ArticlePage.getInitialProps(nextProps);
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  render() {
    const { article, subject, status, topicPath, locale } = this.props;
    const { topicId } = getUrnIdsFromProps(this.props);
    if (status === 'error' || status === 'error404') {
      return (
        <div>
          <ArticleHero subject={subject} topicPath={topicPath} article={{}} />
          <ArticleErrorMessage
            subject={subject}
            topicPath={topicPath}
            status={status}>
            {subject &&
              topicId && (
                <TopicResources subjectId={subject.id} topicId={topicId} />
              )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const scripts = getArticleScripts(article);

    return (
      <div>
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
        {article && (
          <ArticleHero
            subject={subject}
            topicPath={topicPath}
            article={article}
          />
        )}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            {...getArticleProps(article)}>
            {subject &&
              topicId && (
                <TopicResources subjectId={subject.id} topicId={topicId} />
              )}
          </Article>
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
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

const mapStateToProps = (state, ownProps) => {
  const { resourceId, subjectId, topicId } = getUrnIdsFromProps(ownProps);
  const getTopicPathSelector =
    subjectId && topicId ? getTopicPath(subjectId, topicId) : () => undefined;
  const getSubjectByIdSelector = subjectId
    ? getSubjectById(subjectId)
    : () => undefined;
  return {
    article: getArticle(resourceId)(state),
    status: getFetchStatus(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    locale: getLocale(state),
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
  withTracker,
)(ArticlePage);
