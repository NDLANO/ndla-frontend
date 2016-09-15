/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { toArticle } from '../../../routes';
import { titlesI18N } from '../../../util/i18nFieldFinder';

const SearchResult = ({ article, locale }) => (
  <div className="search-result">
    <Link className="search-result_link" to={toArticle(article.id)}>
      <h3 className="search-result_title">
        { titlesI18N(article, locale) }
      </h3>
    </Link>
  </div>
);

SearchResult.propTypes = {
  article: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};


export default SearchResult;
