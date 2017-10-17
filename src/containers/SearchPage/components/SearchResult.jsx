/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Link from 'react-router-dom/Link';
import { toArticle } from '../../../routeHelpers';
import { ArticleResultShape } from '../../../shapes';

const SearchResult = ({ article }) => (
  <div className="search-result">
    <Link className="search-result__link" to={toArticle(article.id)}>
      <h1 className="search-result__title">{article.title.title}</h1>
    </Link>
  </div>
);

SearchResult.propTypes = {
  article: ArticleResultShape.isRequired,
};

export default SearchResult;
