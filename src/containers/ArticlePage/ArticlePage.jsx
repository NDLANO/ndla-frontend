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
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Hero, OneColumn, TopicBreadcrumb } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

import { toTopic } from '../../routeHelpers';
import * as actions from './articleActions';
import { getTopicPath, actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getArticle } from './articleSelectors';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape, SubjectShape, TopicShape } from '../../shapes';
import Article from './components/Article';
import config from '../../config';

const assets = __CLIENT__ // eslint-disable-line no-nested-ternary
  ? window.assets
  : config.isProduction
    ? require('../../../htdocs/assets/assets') // eslint-disable-line import/no-unresolved
    : require('../../../server/developmentAssets');

class ArticlePage extends Component {
  componentWillMount() {
    const {
      fetchArticle,
      fetchTopics,
      fetchSubjects,
      match: { params },
    } = this.props;
    const { articleId, subjectId, resourceId } = params;
    fetchArticle({ articleId, resourceId });
    if (subjectId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }
  }

  componentDidMount() {
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
    const { article, subject, topicPath, locale, t } = this.props;
    if (!article) {
      return null;
    }
    if (article.status === 404) {
      // tmp hack
      return <h1>404 Fant ikke artikkelen</h1>;
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
        src: `https://cdn.mathjax.org/mathjax/2.7-latest/MathJax.js?config=/assets/${assets[
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
          <Article
            article={article}
            subject={subject}
            topicPath={topicPath}
            locale={locale}
          />
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
  const getTopicPathSelector = subjectId && topicId
    ? getTopicPath(subjectId, topicId)
    : () => undefined;
  const getSubjectByIdSelector = subjectId
    ? getSubjectById(subjectId)
    : () => undefined;
  return state => ({
    article: getArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    locale: getLocale(state),
  });
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  injectT,
)(ArticlePage);
