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
import isEmpty from 'lodash/isEmpty';
import { OneColumn } from 'ndla-ui';

import * as actions from './articleActions';
import { getArticle } from './articleSelectors';
import Article from './components/Article';

class ArticlePage extends Component {
  componentWillMount() {
    const { fetchArticle, params: { articleId } } = this.props;
    fetchArticle(articleId);
  }

  render() {
    const { article } = this.props;
    const scripts = article.requiredLibraries ? article.requiredLibraries.map(lib => ({ src: lib.url, type: lib.mediaType })) : [];
    return (
      <OneColumn>
        <Helmet
          title={`NDLA | ${article.title}`}
          script={scripts}
        />
        {!isEmpty(article) ? <Article article={article} /> : null}
      </OneColumn>
    );
  }
}

ArticlePage.propTypes = {
  params: PropTypes.shape({
    articleId: PropTypes.string.isRequired,
  }).isRequired,
  article: PropTypes.object.isRequired,
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
  });
};


export default connect(makeMapStateToProps, mapDispatchToProps)(ArticlePage);
