/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

import { injectT } from '../../../i18n';

const Author = ({ author }) => (
  <span>{author.name}</span>
);

Author.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

const Article = ({ article, t }) => {
  const authors = article.copyright.authors.map(author => author.name).join(', ');
  return (
    <article className="article">
      <h1>{article.title}</h1>
      <span className="article_meta">{t('article.published')}: {article.created}, {authors}</span>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
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
};


export default injectT(Article);
