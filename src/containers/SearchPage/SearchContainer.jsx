/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes, {
  func,
  number,
  string,
  arrayOf,
  shape,
  bool,
} from 'prop-types';
import Pager from '@ndla/pager';
import { SearchPage } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { Query } from 'react-apollo';
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
import {
  convertSearchParam,
  convertResult,
  getResultMetadata,
} from './searchHelpers';
import { searchQuery } from '../../queries';
import handleError from '../../util/handleError';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    const { searchParams } = props;
    this.state = {
      query: searchParams.query || '',
    };
  }

  onQuerySubmit = evt => {
    evt.preventDefault();
    this.updateFilter({ query: this.state.query });
  };

  onFilterChange = (newValues, value, type) => {
    const { searchParams } = this.props;
    const { subjects } = searchParams;
    if (type === 'subjects' && newValues.length < subjects.length) {
      this.onRemoveSubject({ subjects: newValues }, value);
    } else {
      this.updateFilter({ [type]: newValues });
    }
  };

  onRemoveSubject = (subjectsSearchParam, subjectId) => {
    const { searchParams, data, handleSearchParamsChange } = this.props;
    const { levels } = searchParams;
    const subject = data.subjects.find(s => s.id === subjectId);

    const removedFilters = subject.filters
      ? subject.filters.map(level => level.name)
      : [];

    handleSearchParamsChange({
      ...subjectsSearchParam,
      levels: levels.filter(level => !removedFilters.includes(level)),
    });
  };

  onSearchFieldFilterRemove = removedSubject => {
    const { searchParams } = this.props;
    const { subjects: subjectsInUrl } = searchParams;

    const subjects = subjectsInUrl.filter(
      subject => subject !== removedSubject,
    );
    this.onRemoveSubject({ subjects }, removedSubject);
  };

  onUpdateContextFilters = values => {
    const { handleSearchParamsChange } = this.props;
    handleSearchParamsChange({
      contextFilters: values,
    });
  };

  getEnabledTab = stateSearchParams => {
    const { allTabValue } = this.props;
    if (stateSearchParams.resourceTypes) {
      return stateSearchParams.resourceTypes;
    }
    if (stateSearchParams.contextTypes) {
      return stateSearchParams.contextTypes;
    }
    return allTabValue;
  };

  updateFilter = searchParam => {
    const { handleSearchParamsChange } = this.props;
    const page = searchParam.page || 1;
    handleSearchParamsChange({
      ...searchParam,
      page,
    });
  };

  updateTab = (value, enabledTabs) => {
    const { handleSearchParamsChange, allTabValue } = this.props;
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

  updateQuery = query => {
    this.setState({ query });
  };

  render() {
    const {
      t,
      data,
      locale,
      searchParams,
      includeEmbedButton,
      ltiData,
      enabledTabs,
      allTabValue,
    } = this.props;
    const { subjects } = data;
    const { query } = this.state;

    const stateSearchParams = {};
    Object.keys(searchParams).forEach(key => {
      stateSearchParams[key] = convertSearchParam(searchParams[key]);
    });
    const enabledTab = this.getEnabledTab(stateSearchParams);
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
                    filterName: subject.name,
                  }
                : undefined;
            })
            .filter(subject => !!subject)
        : [];

    const searchFilters = (
      <SearchFilters
        onChange={this.onFilterChange}
        searchParams={searchParams}
        subjects={subjects}
        enabledTab={enabledTab}
        activeSubjects={activeSubjectsMapped}
        enabledTabs={enabledTabs}
        onContentTypeChange={this.onTabChange}
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
    return (
      <Query
        asyncMode
        query={searchQuery}
        variables={stateSearchParams}
        fetchPolicy="no-cache"
        ssr={false}>
        {queryResult => {
          const { error, data: searchData } = queryResult;
          if (error) {
            handleError(error);
            return `Error: ${error.message}`;
          }
          const { search } = searchData || {};
          const resultMetadata = search ? getResultMetadata(search) : {};

          const isReadyToShow = queryResult && !queryResult.loading && search;
          const searchResults = isReadyToShow
            ? convertResult(
                search.results,
                searchParams.subjects,
                enabledTab,
                locale,
              )
            : [];

          return (
            <SearchPage
              closeUrl="/#"
              searchString={query || ''}
              onSearchFieldChange={e => this.updateQuery(e.target.value)}
              onSearch={this.onQuerySubmit}
              onSearchFieldFilterRemove={this.onSearchFieldFilterRemove}
              searchFieldFilters={activeSubjectsMapped}
              activeFilters={activeSubjectsMapped}
              messages={searchPageMessages(resultMetadata.totalCount)}
              resourceToLinkProps={resourceToLinkProps}
              filters={searchFilters}>
              <SearchResults
                results={searchResults}
                resourceTypes={
                  data && data.resourceTypes ? data.resourceTypes : []
                }
                enabledTab={enabledTab}
                resultMetadata={resultMetadata}
                searchParams={searchParams}
                enabledTabs={enabledTabs}
                allTabValue={allTabValue}
                onTabChange={this.updateTab}
                query={searchParams.query}
                onUpdateContextFilters={this.onUpdateContextFilters}
                includeEmbedButton={includeEmbedButton}
                ltiData={ltiData}
              />
              {isReadyToShow && (
                <Pager
                  page={searchParams.page ? parseInt(searchParams.page, 10) : 1}
                  lastPage={resultMetadata.lastPage}
                  query={searchParams}
                  pathname=""
                  onClick={this.updateFilter}
                  pageItemComponentClass="button"
                />
              )}
            </SearchPage>
          );
        }}
      </Query>
    );
  }
}

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
};

SearchContainer.defaultProps = {
  filters: [],
  subjects: [],
  searchParams: {},
  data: {},
  handleSearchParamsChange: () => {},
  allTabValue: 'all',
};

export default injectT(SearchContainer);
