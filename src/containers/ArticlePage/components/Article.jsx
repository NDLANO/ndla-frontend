/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

import ArticleIntroduction from './ArticleIntroduction';
import ArticleFootNotes from './ArticleFootNotes';
import { injectT } from '../../../i18n';
import ArticleLicenses from './ArticleLicenses';

const Article = ({ article, locale }) => {
  const licenseType = article.copyright.license.license;

  return (
    <article className="c-article">
      <ArticleLicenses
        article={article}
        locale={locale}
        licenseType={licenseType}
        contentType={article.contentType}
      />
      <h1>{article.title}</h1>
      <ArticleIntroduction introduction={article.introduction} />
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      { article.footNotes ? <ArticleFootNotes footNotes={article.footNotes} /> : null }
      <ArticleLicenses
        showByline
        article={article}
        locale={locale}
        licenseType={licenseType}
        contentType={article.contentType}
      />
    </article>
  );
};

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
