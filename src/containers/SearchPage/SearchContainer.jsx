/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useReducer } from 'react';
import PropTypes, {
  func,
  number,
  string,
  arrayOf,
  shape,
  bool,
  object,
} from 'prop-types';
import { SearchTypeResult, SearchHeader, constants } from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import {
  SubjectShape,
  FilterShape,
  LtiDataShape,
  SearchParamsShape,
} from '../../shapes';
import {
  GraphqlResourceTypeWithsubtypesShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import { convertResult, getResultMetadata } from './searchHelpers';
import handleError from '../../util/handleError';

import {
  subjectTypeResults,
  subjectMaterialResults,
  searchTypeFilterOptions,
  searchSubjectTypeOptions,
  topicResults,
} from './mockData';

const { contentTypes } = constants;

const subjectDataSource = {
  items: subjectTypeResults,
  totalCount: subjectTypeResults.length,
  type: contentTypes.SUBJECT,
};

const responseDataSource = [
  {
    items: topicResults,
    totalCount: topicResults.length,
    type: contentTypes.TOPIC,
  },
  {
    items: subjectMaterialResults,
    totalCount: subjectMaterialResults.length,
    type: contentTypes.SUBJECT_MATERIAL,
  },
];

const searchResults = [...responseDataSource, subjectDataSource];
const initialTypeFilter = {};
searchResults.forEach(item => {
  const pageSize = item.type === contentTypes.SUBJECT ? 2 : 4;
  const filters = [];
  if (searchTypeFilterOptions[item.type].length) {
    filters.push({ id: 'all', name: 'Alle', active: true });
    filters.push(...searchTypeFilterOptions[item.type]);
  }
  initialTypeFilter[item.type] = {
    filters: filters,
    page: 1,
    loading: false,
    pageSize,
  };
});

const initialResults = searchResults.map(res => {
  if (res.items.length > initialTypeFilter[res.type].pageSize) {
    return {
      ...res,
      items: res.items.slice(0, initialTypeFilter[res.type].pageSize),
    };
  }
  return res;
});

const resultsReducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH':
      return state.map(contextItem => {
        if (contextItem.type === action.context) {
          return {
            ...contextItem,
            loading: true,
          };
        } else {
          return contextItem;
        }
      });
    case 'SEARCH_RESULT_UPDATE':
      return state.map(contextItem => {
        if (contextItem.type === action.results.contextType) {
          return {
            ...contextItem,
            // append new items
            items: action.results.items,
            loading: false,
          };
        } else {
          return contextItem;
        }
      });
    default:
      return state;
  }
};

const SearchContainer = ({
  t,
  data,
  locale,
  searchParams,
  includeEmbedButton,
  ltiData,
  enabledTabs,
  allTabValue,
  enabledTab,
  isLti,
  handleSearchParamsChange,
  loading,
  error,
  searchData,
}) => {
  const [searchItems, dispatch] = useReducer(
    resultsReducer,
    initialResults
  );

  return (
    <>
      <SearchHeader
        count={123}
        searchPhrase="nunorsk"
        searchPhraseSuggestion="nynorsk"
        searchPhraseSuggestionOnClick={() =>
          console.log('search-phrase suggestion click')
        }
      />
      <SearchResults searchItems={searchItems} />
      <FilterTabs
        dropdownBtnLabel="Velg"
        value={'ALL'}
        options={searchSubjectTypeOptions}
        contentId="search-result-content"
        onChange={() => {}}>
      </FilterTabs>
    </>
  );
};

SearchContainer.propTypes = {
  subjects: arrayOf(SubjectShape),
  resultMetadata: shape({
    totalCount: number,
    lastPage: number,
  }),
  filters: arrayOf(FilterShape),
  match: shape({
    params: shape({
      subjectId: string,
    }),
  }),
  data: shape({
    resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
    subjects: arrayOf(GraphQLSubjectShape),
  }),
  locale: PropTypes.string,
  searchParams: SearchParamsShape,
  handleSearchParamsChange: func,
  includeEmbedButton: bool,
  ltiData: LtiDataShape,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  allTabValue: string,
  enabledTab: string.isRequired,
  isLti: bool,
  error: arrayOf(object),
  loading: bool,
  searchData: shape({ search: object }),
};

SearchContainer.defaultProps = {
  filters: [],
  subjects: [],
  searchParams: {},
  data: {},
  handleSearchParamsChange: () => {},
  allTabValue: 'all',
  isLti: false,
};

export default injectT(SearchContainer);
