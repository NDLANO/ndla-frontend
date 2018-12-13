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
  enabledTab,
  onTabChange,
  query,
  onUpdateContextFilters,
  resourceTypes,
  customResultList,
  allTabValue,
  t,
}) => {
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
      currentTab={enabledTab || allTabValue}>
      <SearchContextFilters
        allTabValue={allTabValue}
        enabledTab={enabledTab}
        filterState={filterState}
        resourceTypes={resourceTypes}
        onUpdateContextFilters={onUpdateContextFilters}
      />
      {customResultList ? (
        customResultList(results, enabledTab)
      ) : (
        <SearchResultList
          messages={{
            subjectsLabel: t(
              'searchPage.searchResultListMessages.subjectsLabel',
            ),
            noResultHeading: t(
              'searchPage.searchResultListMessages.noResultHeading',
            ),
            noResultDescription: t(
              'searchPage.searchResultListMessages.noResultDescription',
            ),
          }}
          results={results && resultsWithContentTypeBadgeAndImage(results, t)}
        />
      )}
    </SearchResult>
  );
};

SearchResults.propTypes = {
  filterState: shape({
    contextFilters: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
    page: string,
    resourceTypes: arrayOf(string),
    subjects: arrayOf(string),
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
  allTabValue: string.isRequired,
  onUpdateContextFilters: func,
  customResultList: func,
  enabledTab: string.isRequired,
};

export default injectT(SearchResults);
