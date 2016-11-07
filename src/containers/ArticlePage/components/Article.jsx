/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';

import ArticleIntroduction from './ArticleIntroduction';
import { injectT } from '../../../i18n';
import LicenseByline from '../../../components/LicenseByline';

class Article extends Component {
  constructor() {
    super();
    this.state = {
      hideLicenseByline: false,
    };
  }

  render() {
    const { article, locale } = this.props;
    const licenseType = article.copyright.license.license;

    return (
      <article className="article">
        <LicenseByline
          article={article}
          locale={locale}
          licenseType={licenseType}
          licenseHandler={() => true}
          contentType={article.contentType}
        />
        <h1>{article.title}</h1>
        <ArticleIntroduction introduction={article.introduction} />
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        <LicenseByline
          article={article}
          locale={locale}
          licenseType={licenseType}
          licenseHandler={() => true}
          contentType={article.contentType}
        />
      </article>
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
