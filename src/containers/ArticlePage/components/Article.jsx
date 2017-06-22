/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Article as UIArticle, LicenseByline, LayoutItem } from 'ndla-ui';
import {
  initArticleScripts,
  removeEventListenerForResize,
  removeAsideClickListener,
} from 'ndla-article-scripts';
import getLicenseByAbbreviation from 'ndla-licenses';
import { injectT } from 'ndla-i18n';
import ArticleFootNotes from './ArticleFootNotes';
import ToggleLicenseBox from './ToggleLicenseBox';
import ArticleByline from './ArticleByline';
import LicenseBox from '../../../components/license/LicenseBox';

class Article extends Component {
  componentDidMount() {
    initArticleScripts();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  renderToggleLicenseBox(showByline = false) {
    const { article, locale, t } = this.props;
    const licenseType = article.copyright.license.license;
    const authorsList = article.copyright.authors
      .map(author => author.name)
      .join(', ');
    const license = getLicenseByAbbreviation(licenseType, locale);

    return (
      <ToggleLicenseBox
        openTitle={t('article.openLicenseBox')}
        closeTitle={t('article.closeLicenseBox')}
        licenseBox={
          <LicenseBox article={article} locale={locale} license={license} />
        }>
        {showByline
          ? <LicenseByline license={license}>
              <span className="article_meta">
                {authorsList}. Publisert: {article.created}
              </span>
              .
            </LicenseByline>
          : null}
      </ToggleLicenseBox>
    );
  }

  render() {
    const { article } = this.props;

    return (
      <section className="c-article">
        <LayoutItem layout="center">
          <h1>{article.title}</h1>
          <UIArticle.Introduction introduction={article.introduction} />
          <ArticleByline
            authors={article.copyright.authors}
            updated={article.updated}
          />
          {this.renderToggleLicenseBox()}
        </LayoutItem>
        <LayoutItem layout="center">
          <UIArticle.Content content={article.content} />
        </LayoutItem>
        <LayoutItem layout="center">
          {article.footNotes
            ? <ArticleFootNotes footNotes={article.footNotes} />
            : null}
          {this.renderToggleLicenseBox()}
          <a
            className="article-old-ndla-link"
            rel="noopener noreferrer"
            target="_blank"
            href={article.oldNdlaUrl}>
            Gå til orginal artikkel
          </a>
        </LayoutItem>
      </section>
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
