/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import SearchResult from './SearchResult';
import { injectT } from '../../../i18n';

const SearchResultList = ({ results, query, locale, t }) => {
  const noSearchHits = query.query && results.length === 0;
  return (
    <div className="search-results">
      { noSearchHits ?
        <p>{ t('searchPage.noHits', query)}</p>
          :
        results.map(result => <SearchResult key={result.id} locale={locale} article={result} />) }
    </div>
  );
};

SearchResultList.propTypes = {
  results: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};


export default injectT(SearchResultList);
