/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchResult, SearchResultList } from 'ndla-ui';
import { func, arrayOf, shape, string, number } from 'prop-types';
import { injectT } from 'ndla-i18n';
import {
  converSearchStringToObject,
  resultsWithContentTypeBadgeAndImage,
} from '../searchHelpers';
import { ArticleResultShape, LocationShape } from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';
import SearchContextFilters from './SearchContextFilters';

const SearchResults = ({
  results,
  resultMetadata,
  filterState,
  enabledTabs,
  onTabChange,
  location,
  onUpdateContextFilters,
  resourceTypes,
  t,
}) => {
  const enabledTab =
    filterState['resource-types'] || filterState['context-types'];

  const searchObject = converSearchStringToObject(location);
  return (
    <SearchResult
      messages={{
        searchStringLabel: t(
          'searchPage.searchResultMessages.searchStringLabel',
        ),
        subHeading: t('searchPage.searchResultMessages.subHeading', {
          totalCount: resultMetadata.totalCount,
        }),
        dropdownBtnLabel: t('searchPage.searchPageMessages.dropdownBtnLabel'),
      }}
      searchString={searchObject.query || ''}
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
        results={resultsWithContentTypeBadgeAndImage(results, t, enabledTab)}
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
  location: LocationShape,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onTabChange: func,
  results: arrayOf(ArticleResultShape).isRequired,
  resultMetadata: shape({
    totalCount: number,
  }),
  onUpdateContextFilters: func,
};

export default injectT(SearchResults);
