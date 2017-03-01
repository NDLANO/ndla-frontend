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
import { OneColumn } from 'ndla-ui';
import * as actions from './articleActions';
import { getArticle } from './articleSelectors';
import { getLocale } from '../Locale/localeSelectors';
import { ArticleShape } from '../../shapes';
import Article from './components/Article';

class ArticlePage extends Component {
  componentWillMount() {
    const { fetchArticle, params: { articleId } } = this.props;
    fetchArticle(articleId);
  }

  render() {
    const { article, locale } = this.props;
    if (!article) {
      return null;
    }
    const scripts = article.requiredLibraries ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    const metaDescription = article.metaDescription ? { name: 'description', content: article.metaDescription } : {};
    return (
      <OneColumn>
        <Helmet
          title={`NDLA | ${article.title}`}
          meta={[metaDescription]}
          script={scripts}
        />
        <Article article={article} locale={locale} />
      </OneColumn>
    );
  }
}

ArticlePage.propTypes = {
  params: PropTypes.shape({
    articleId: PropTypes.string.isRequired,
  }).isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  fetchArticle: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
};

const makeMapStateToProps = (_, ownProps) => {
  const articleId = ownProps.params.articleId;
  const getArticleSelector = getArticle(articleId);
  return state => ({
    article: getArticleSelector(state),
    locale: getLocale(state),
  });
};


export default connect(makeMapStateToProps, mapDispatchToProps)(ArticlePage);
