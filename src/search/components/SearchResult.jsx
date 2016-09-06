/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { toArticle } from '../../main/routes';

const SearchResult = ({ article }) => (
  <div className="search-result">
    <Link className="search-result_link" to={toArticle(article.id)}>
      <h3 className="search-result_title">
        {article.title}
      </h3>
    </Link>
  </div>
);

SearchResult.propTypes = {
  article: PropTypes.object.isRequired,
};


export default SearchResult;
