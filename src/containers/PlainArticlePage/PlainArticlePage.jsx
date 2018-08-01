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
import { transformArticle } from '../../util/transformArticle';
import { ArticleShape } from '../../shapes';
import Article from '../../components/Article';
import ArticleHero from '../ArticlePage/components/ArticleHero';
import ArticleErrorMessage from '../ArticlePage/components/ArticleErrorMessage';
import { fetchArticle } from '../ArticlePage/articleApi';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';

const getTitle = article => (article ? article.title : '');

class PlainArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { article } = currentProps;
    if (article && article.id) {
      trackPageView(currentProps);
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

  static getDimensions(props) {
    return getAllDimensions(props, undefined, true);
  }

  static getDocumentTitle({ t, article }) {
    return `${getTitle(article)}${t('htmlTitles.titleTemplate')}`;
  }

  static async getInitialProps(ctx) {
    const {
      match: { params },
      locale,
    } = ctx;
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

  render() {
    const { article: rawArticle, status, locale } = this.props;

    if (status === 'error' || status === 'error404') {
      return (
        <div>
          <ArticleHero resource={{}} />
          <ArticleErrorMessage status={status} />
        </div>
      );
    }

    const article = transformArticle(rawArticle, locale);
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
        {article && <ArticleHero resource={article} />}
        <OneColumn>
          <Article article={article} locale={locale} {...getArticleProps()} />
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

export default compose(
  injectT,
  withTracker,
)(PlainArticlePage);
