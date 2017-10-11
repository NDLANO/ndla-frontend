/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import SearchResult from './SearchResult';
import { ArticleResultShape } from '../../../shapes';

const SearchResultList = ({ results, query, t }) => {
  const noSearchHits = query.query && results.length === 0;
  return (
    <div className="search-results">
      {noSearchHits ? (
        <p>{t('searchPage.noHits', { query: query.query })}</p>
      ) : (
        results.map(result => <SearchResult key={result.id} article={result} />)
      )}
    </div>
  );
};

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(ArticleResultShape).isRequired,
  query: PropTypes.shape({
    query: PropTypes.string,
  }),
};

export default injectT(SearchResultList);
