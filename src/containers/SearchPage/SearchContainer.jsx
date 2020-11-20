/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
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
import { getTypeFilter, getSearchGroups } from './searchHelpers';
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

const SearchContainer = ({
  searchParams,
  error,
  searchData,
  pageParams,
  setPageParams
}) => {
  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter(searchData));
  const [searchGroups, setSearchGroups] = useState(getSearchGroups(searchData, false));

  useEffect(() => {
    const updatedSearchGroups = getSearchGroups(searchData);
    setSearchGroups(searchGroups.map(group => {
      const updatedGroup = updatedSearchGroups.find(x => x.type === group.type);
      return {
        ...group,
        items: [...group.items, ...updatedGroup.items],
        loading: false
      }
    }));
  }, [searchData]);

  const setLoadingOnGroup = type => {
    searchGroups.find(group => group.type === type).loading = true;
  }

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

  const handleSetSubjectType = type => {
    if (type === 'ALL') {
      setCurrentSubjectType(null);
    } else {
      if (typeFilter[type]) {
        const filterUpdate = { ...typeFilter };
        filterUpdate[type] = {
          ...filterUpdate[type],
          pageSize: 8,
          page: 1,
        };
        setTypeFilter(filterUpdate);
        setLoadingOnGroup(type);
        setPageParams({
          page: 1,
          pageSize: 8,
        })
      }
      setCurrentSubjectType(type);
    }
  };

  const handleShowMore = type => {
    const filterUpdate = { ...typeFilter[type] };
    filterUpdate.pageSize += type === contentTypes.SUBJECT ? 2 : 4;
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
    if (type !== contentTypes.SUBJECT && filterUpdate.pageSize > 4 * pageParams.page) {
      setLoadingOnGroup(type);
      setPageParams(prevState => ({
        ...prevState,
        page: prevState.page + 1
      }))
    }
  };

  const handleShowAll = type => {
    handleSetSubjectType(type);
  } 

  const onPagerNavigate = pagerEvent => {
    const { type, page} = pagerEvent;
    const filterUpdate = { ...typeFilter[type] };
    filterUpdate.page = page;
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
    if (type !== contentTypes.SUBJECT && page > pageParams.page) {
      setLoadingOnGroup(type);
      setPageParams({
        page,
        pageSize: 8,
      })
    }
  }

  return (
    <>
      <SearchHeader
        count={searchGroups.reduce((acc, item) => acc + item.totalCount, 0)}
        searchPhrase={searchParams.query}
        searchPhraseSuggestion="nynorsk"
        searchPhraseSuggestionOnClick={() =>
          console.log('search-phrase suggestion click')
        }
      />
      <FilterTabs
        dropdownBtnLabel="Velg"
        value={'ALL'}
        options={searchSubjectTypeOptions}
        contentId="search-result-content"
        onChange={handleSetSubjectType}>
        <SearchResults
          searchGroups={searchGroups.filter(
            item => item.type !== contentTypes.SUBJECT,
          )}
          currentSubjectType={currentSubjectType}
          typeFilter={typeFilter}
          handleFilterClick={handleFilterClick}
          handleShowMore={handleShowMore}
          handleShowAll={handleShowAll}
          onPagerNavigate={onPagerNavigate}
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
