/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchResult, SearchResultList } from '@ndla/ui';
import { func, arrayOf, shape, string, number, bool } from 'prop-types';
import { injectT } from '@ndla/i18n';
import { resultsWithContentTypeBadgeAndImage } from '../searchHelpers';
import {
  ArticleResultShape,
  LtiDataShape,
  SearchParamsShape,
} from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';
import SearchContextFilters from './SearchContextFilters';

const SearchResults = ({
  results,
  resultMetadata,
  searchParams,
  enabledTabs,
  enabledTab,
  onTabChange,
  query,
  onUpdateContextFilters,
  resourceTypes,
  includeEmbedButton,
  ltiData,
  allTabValue,
  t,
  loading,
  isLti,
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
        searchParams={searchParams}
        resourceTypes={resourceTypes}
        onUpdateContextFilters={onUpdateContextFilters}
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
        loading={loading}
        results={
          results &&
          resultsWithContentTypeBadgeAndImage(
            results,
            t,
            includeEmbedButton,
            ltiData,
            isLti,
          )
        }
      />
    </SearchResult>
  );
};

SearchResults.propTypes = {
  searchParams: SearchParamsShape,
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
  includeEmbedButton: bool,
  ltiData: LtiDataShape,
  enabledTab: string.isRequired,
  loading: bool,
  isLti: bool,
};

export default injectT(SearchResults);
