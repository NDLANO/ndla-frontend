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
import { SearchHeader, constants } from '@ndla/ui';
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
import SearchResults from './components/SearchResults';
import handleError from '../../util/handleError';

const { contentTypes } = constants;

const searchSubjectTypeOptions = [
  {
    title: 'Alle',
    value: 'ALL',
  },
  {
    title: 'Emne',
    value: 'topic',
  },
  {
    title: 'Fagstoff',
    value: 'subject-material',
  },
];

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
  initialResults,
  initialTypeFilter,
}) => {
  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [searchItems, dispatch] = useReducer(resultsReducer, initialResults);

  const handleFilterClick = (type, filterId) => {
    const filterUpdate = { ...typeFilter[type] };
    const filters = [...filterUpdate.filters];
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
    } else {
      const allFilter = filters.find(item => 'all' === item.id);
      allFilter.active = false;
      selectedFilter.active = !selectedFilter.active;
      if (!filters.some(item => item.active)) {
        allFilter.active = true;
      }
    }
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
  };

  return (
    <>
      <SearchHeader
        count={searchItems.reduce((acc, item) => acc + item.totalCount, 0)}
        searchPhrase={searchParams.query}
        searchPhraseSuggestion="nynorsk"
        searchPhraseSuggestionOnClick={() =>
          console.log('search-phrase suggestion click')
        }
      />
      <SearchResults
        searchItems={searchItems.filter(
          item => item.type === contentTypes.SUBJECT,
        )}
        handleFilterClick={handleFilterClick}
      />
      <FilterTabs
        dropdownBtnLabel="Velg"
        value={'ALL'}
        options={searchSubjectTypeOptions}
        contentId="search-result-content"
        onChange={() => {}}>
        <SearchResults
          searchItems={searchItems.filter(
            item => item.type !== contentTypes.SUBJECT,
          )}
          currentSubjectType={currentSubjectType}
          typeFilter={typeFilter}
          handleFilterClick={handleFilterClick}
        />
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
