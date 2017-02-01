/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';

import { Article as UIArticle } from 'ndla-ui';
import ArticleFootNotes from './ArticleFootNotes';
import { injectT } from '../../../i18n';
import ArticleLicenses from './ArticleLicenses';
import {
  addEventListenerForResize,
  updateIFrameDimensions,
  addAsideClickListener,
  removeEventListenerForResize,
  removeAsideClickListener } from '../../../util/articleScripts';


class Article extends Component {

  componentDidMount() {
    addEventListenerForResize();
    updateIFrameDimensions();
    addAsideClickListener();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  render() {
    const { article, locale } = this.props;

    const licenseType = article.copyright.license.license;

    return (
      <UIArticle>
        <ArticleLicenses
          article={article}
          locale={locale}
          licenseType={licenseType}
          contentType={article.contentType}
        />
        <h1>{article.title}</h1>
        <UIArticle.Introduction introduction={article.introduction} />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        { article.footNotes ? <ArticleFootNotes footNotes={article.footNotes} /> : null }
        <ArticleLicenses
          showByline
          article={article}
          locale={locale}
          licenseType={licenseType}
          contentType={article.contentType}
        />
      </UIArticle>
    );
  }
}


Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
};


export default injectT(Article);
