/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchResult, SearchResultList } from '@ndla/ui';
import { func, arrayOf, shape, string, number } from 'prop-types';
import { injectT } from '@ndla/i18n';
import { resultsWithContentTypeBadgeAndImage } from '../searchHelpers';
import { ArticleResultShape } from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';
import SearchContextFilters from './SearchContextFilters';

const SearchResults = ({
  results,
  resultMetadata,
  filterState,
  enabledTabs,
  onTabChange,
  query,
  onUpdateContextFilters,
  resourceTypes,
  t,
}) => {
  const enabledTab = filterState.resourceTypes || filterState.contextTypes;
  const { totalCount = '' } = resultMetadata || {};
  return (
    <SearchResult
      messages={{
        searchStringLabel: t(
          'searchPage.searchResultMessages.searchStringLabel',
        ),
        subHeading: t('searchPage.searchResultMessages.subHeading', {
          totalCount,
        }),
        resultHeading: t('searchPage.searchPageMessages.resultHeading', {
          totalCount,
        }),
        dropdownBtnLabel: t('searchPage.searchPageMessages.dropdownBtnLabel'),
      }}
      searchString={query || ''}
      tabOptions={enabledTabs.map(tab => ({
        value: tab.value,
        title: tab.name,
      }))}
      onTabChange={tab => onTabChange(tab, enabledTabs)}
      currentTab={enabledTab || 'all'}>
      <SearchContextFilters
        filterState={filterState}
        resourceTypes={resourceTypes}
        onUpdateContextFilters={onUpdateContextFilters}
        results={results}
      />
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
        results={
          results && resultsWithContentTypeBadgeAndImage(results, t, enabledTab)
        }
      />
    </SearchResult>
  );
};

SearchResults.propTypes = {
  filterState: shape({
    resourceTypes: string,
    subjects: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
  }),
  query: string,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onTabChange: func,
  results: arrayOf(ArticleResultShape),
  resultMetadata: shape({
    totalCount: number,
  }),
  onUpdateContextFilters: func,
};

export default injectT(SearchResults);
