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
import { ArticleShape } from '../../shapes';
import Article from '../../components/Article';
import ArticleHero from '../ArticlePage/components/ArticleHero';
import ArticleErrorMessage from '../ArticlePage/components/ArticleErrorMessage';
import { fetchArticle } from '../ArticlePage/articleApi';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';

const getTitle = article => (article ? article.title : '');

class PlainArticlePage extends Component {
  static async getInitialProps(ctx) {
    const { match: { params }, locale } = ctx;
    const { articleId } = params;

    try {
      const article = await fetchArticle(articleId, locale);
      return { article, status: 'success' };
    } catch (error) {
      const status =
        error.json && error.json.status === 404 ? 'error404' : 'error';
      return { status };
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
    const { article, status, locale } = this.props;

    if (status === 'error' || status === 'error404') {
      return (
        <div>
          <ArticleHero article={{}} />
          <ArticleErrorMessage status={status} />
        </div>
      );
    }

    const scripts = getArticleScripts(article);

    return (
      <div>
        <Helmet>
          <title>{`NDLA | ${getTitle(article)}`}</title>
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
        {article && <ArticleHero article={article} />}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            {...getArticleProps(article)}
          />
        </OneColumn>
      </div>
    );
  }
}

PlainArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  article: ArticleShape,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
};

PlainArticlePage.defaultProps = {
  status: 'initial',
};

export default compose(injectT)(PlainArticlePage);
