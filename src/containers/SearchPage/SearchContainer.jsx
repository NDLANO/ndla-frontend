/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import PropTypes, {
  func,
  number,
  string,
  arrayOf,
  shape,
  bool,
  object,
} from 'prop-types';
import Pager from '@ndla/pager';
import { SearchPage } from '@ndla/ui';
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
  const [query, setQuery] = useState(searchParams.query || '');

  const onQuerySubmit = evt => {
    evt.preventDefault();
    updateFilter({ query });
  };

  const onFilterChange = (newValues, value, type) => {
    const { subjects } = searchParams;
    if (type === 'subjects' && newValues.length < subjects.length) {
      onRemoveSubject({ subjects: newValues }, value);
    } else {
      updateFilter({ [type]: newValues });
    }
  };

  const onRemoveSubject = (subjectsSearchParam, subjectId) => {
    const { levels } = searchParams;
    const subject = data.subjects.find(s => s.id === subjectId);

    const removedFilters = subject.filters?.map(level => level.name) || [];

    handleSearchParamsChange({
      ...subjectsSearchParam,
      levels: levels.filter(level => !removedFilters.includes(level)),
    });
  };

  const onSearchFieldFilterRemove = removedSubject => {
    const { subjects: subjectsInUrl } = searchParams;

    const subjects = subjectsInUrl.filter(
      subject => subject !== removedSubject,
    );
    onRemoveSubject({ subjects }, removedSubject);
  };

  const onUpdateContextFilters = values => {
    handleSearchParamsChange({
      contextFilters: values,
    });
  };

  const updateFilter = searchParam => {
    const page = searchParam.page || 1;
    handleSearchParamsChange({
      ...searchParam,
      page,
    });
  };

  const updateTab = (value, enabledTabs) => {
    const enabledTab = enabledTabs.find(tab => value === tab.value);
    const newParams =
      !enabledTab || enabledTab.value === allTabValue
        ? {}
        : { [enabledTab.type]: [enabledTab.value] };

    handleSearchParamsChange({
      contextTypes: undefined,
      resourceTypes: undefined,
      contextFilters: [],
      ...newParams,
      page: 1,
    });
  };

  const { subjects } = data;

  const activeSubjectsMapped =
    subjects && subjects.length > 0
      ? searchParams.subjects
          .map(it => {
            const subject = subjects.find(s => s.id === it);
            return subject
              ? {
                  ...subject,
                  value: subject.id,
                  title: subject.name,
                  filterName: 'filter_subjects',
                }
              : undefined;
          })
          .filter(subject => !!subject)
      : [];

  const searchFilters = (
    <SearchFilters
      onChange={onFilterChange}
      searchParams={searchParams}
      subjects={subjects}
      enabledTab={enabledTab}
      activeSubjects={activeSubjectsMapped}
      enabledTabs={enabledTabs}
    />
  );

  const searchPageMessages = totalCount => ({
    filterHeading: t('searchPage.searchPageMessages.filterHeading'),
    dropdownBtnLabel: t('searchPage.searchPageMessages.dropdownBtnLabel'),
    closeButton: t('searchPage.close'),
    narrowScreenFilterHeading: t(
      'searchPage.searchPageMessages.narrowScreenFilterHeading',
      {
        totalCount,
        query,
      },
    ),
    searchFieldTitle: t('searchPage.search'),
  });

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  const { search } = searchData || {};
  const resultMetadata = search ? getResultMetadata(search) : {};

  const isReadyToShow = !loading && search;
  const searchResults = isReadyToShow
    ? convertResult(search.results, searchParams.subjects, enabledTab, locale)
    : [];
  return (
    <SearchPage
      closeUrl="/#"
      searchString={query || ''}
      onSearchFieldChange={setQuery}
      onSearch={onQuerySubmit}
      onSearchFieldFilterRemove={onSearchFieldFilterRemove}
      searchFieldFilters={activeSubjectsMapped}
      activeFilters={activeSubjectsMapped}
      messages={searchPageMessages(resultMetadata.totalCount)}
      resourceToLinkProps={resourceToLinkProps}
      filters={searchFilters}>
      <SearchResults
        results={searchResults}
        resourceTypes={data && data.resourceTypes ? data.resourceTypes : []}
        loading={loading}
        enabledTab={enabledTab}
        resultMetadata={resultMetadata}
        searchParams={searchParams}
        enabledTabs={enabledTabs}
        allTabValue={allTabValue}
        onTabChange={updateTab}
        query={searchParams.query}
        onUpdateContextFilters={onUpdateContextFilters}
        includeEmbedButton={includeEmbedButton}
        ltiData={ltiData}
        isLti={isLti}
      />
      {isReadyToShow && (
        <Pager
          page={searchParams.page ? parseInt(searchParams.page, 10) : 1}
          lastPage={resultMetadata.lastPage}
          query={searchParams}
          pathname=""
          onClick={updateFilter}
          pageItemComponentClass="button"
        />
      )}
    </SearchPage>
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
