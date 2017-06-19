/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { toArticle } from '../../../routeHelpers';
import { titleI18N } from '../../../util/i18nFieldFinder';
import { ArticleResultShape } from '../../../shapes';

const SearchResult = ({ article, locale }) =>
  <div className="search-result">
    <Link className="search-result__link" to={toArticle(article.id)}>
      <h1 className="search-result__title">
        {titleI18N(article, locale, true)}
      </h1>
    </Link>
  </div>;

SearchResult.propTypes = {
  article: ArticleResultShape.isRequired,
  locale: PropTypes.string.isRequired,
};

export default SearchResult;
