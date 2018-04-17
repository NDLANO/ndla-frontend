/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchResult, SearchResultList, ContentTypeBadge } from 'ndla-ui';
import { func, arrayOf, shape, string, number } from 'prop-types';
import { injectT } from 'ndla-i18n';
import { ArticleResultShape } from '../../../shapes';

const resultsWithContentTypeBadge = results =>
  results.map(result => ({
    ...result,
    contentTypeIcon: (
      <ContentTypeBadge type={result.contentType} size="x-small" />
    ),
    contentTypeLabel: result.contentType,
  }));

const SearchResults = ({
  results,
  resultMetadata,
  filterState,
  enabledTabs,
  onTabChange,
  t,
}) => {
  const enabledTab =
    filterState['resource-types'] || filterState['context-types'];
  return (
    <SearchResult
      messages={{
        searchStringLabel: t(
          'searchPage.searchResultMessages.searchStringLabel',
        ),
        subHeading: t('searchPage.searchResultMessages.subHeading', {
          totalCount: resultMetadata.totalCount,
        }),
      }}
      searchString={filterState.query}
      tabOptions={enabledTabs.map(tab => ({
        value: tab.value,
        title: t(`contentTypes.${tab.name}`),
      }))}
      onTabChange={tab => onTabChange(tab)}
      currentTab={enabledTab || 'all'}>
      <SearchResultList
        messages={{
          subjectsLabel: t('searchPage.searchResultListMessages.subjectsLabel'),
          noResultHeading: t(
            'searchPage.searchResultListMessages.noResultHeading',
          ),
          noResultDescription: t(
            'searchPage.searchResultListMessages.noResultDescription',
          ),
        }}
        results={resultsWithContentTypeBadge(results)}
      />
    </SearchResult>
  );
};

SearchResults.propTypes = {
  filterState: shape({
    'resource-types': string,
    subjects: arrayOf(string),
    'language-filter': arrayOf(string),
    levels: arrayOf(string),
  }),
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  onTabChange: func,
  results: arrayOf(ArticleResultShape).isRequired,
  resultMetadata: shape({
    totalCount: number,
  }),
};

export default injectT(SearchResults);
