/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Article as UIArticle, LayoutItem } from 'ndla-ui';
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
import ArticleTitle from './ArticleTitle';
import LicenseBox from '../../../components/license/LicenseBox';

class Article extends Component {
  componentDidMount() {
    initArticleScripts();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  renderToggleLicenseBox(clear = false) {
    const { article, locale, t } = this.props;
    const licenseType = article.copyright.license.license;
    const license = getLicenseByAbbreviation(licenseType, locale);

    return (
      <ToggleLicenseBox
        clear={clear}
        openTitle={t('article.openLicenseBox')}
        closeTitle={t('article.closeLicenseBox')}
        licenseBox={
          <LicenseBox article={article} locale={locale} license={license} />
        }
      />
    );
  }

  render() {
    const { article } = this.props;

    return (
      <section className="c-article">
        <LayoutItem layout="center">
          <ArticleTitle
            title={article.title}
            resourceTypes={article.resourceTypes}
          />
          <UIArticle.Introduction introduction={article.introduction} />
          <ArticleByline
            authors={article.copyright.authors}
            updated={article.updated}>
            {this.renderToggleLicenseBox()}
          </ArticleByline>
        </LayoutItem>
        <LayoutItem layout="center">
          <UIArticle.Content content={article.content} />
        </LayoutItem>
        <LayoutItem layout="center">
          {Object.keys(article.footNotes).length > 0 && (
            <ArticleFootNotes footNotes={article.footNotes} />
          )}
          {this.renderToggleLicenseBox(true)}
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
