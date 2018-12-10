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
import { SubjectShape, FilterShape } from '../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../graphqlShapes';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import {
  convertSearchParam,
  convertResult,
  getResultMetadata,
} from './searchHelpers';
import { runQueries } from '../../util/runQueries';
import {
  searchQuery,
  resourceTypesWithSubTypesQuery,
  subjectsWithFiltersQuery,
} from '../../queries';
import handleError from '../../util/handleError';
import { sortResourceTypes } from '../Resources/getResourceGroups';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    const { searchObject } = props;
    this.state = {
      query: searchObject.query || '',
    };
  }

  onQuerySubmit = evt => {
    evt.preventDefault();
    this.updateFilter({ query: this.state.query });
  };

  onFilterChange = (newValues, value, type) => {
    const { searchObject } = this.props;
    const { subjects } = searchObject;
    if (type === 'subjects' && newValues.length < subjects.length) {
      this.onRemoveSubject({ subjects: newValues }, value);
    } else {
      this.updateFilter({ [type]: newValues });
    }
  };

  onRemoveSubject = (subjectsSearchParam, subjectId) => {
    const { searchObject, data, updateSearchLocation } = this.props;
    const { levels } = searchObject;
    const subject = data.subjects.find(s => s.id === subjectId);

    const removedFilters = subject.filters
      ? subject.filters.map(level => level.name)
      : [];

    updateSearchLocation({
      ...subjectsSearchParam,
      levels: levels.filter(level => !removedFilters.includes(level)),
    });
  };

  onSearchFieldFilterRemove = removedSubject => {
    const { searchObject } = this.props;
    const { subjects: subjectsInUrl } = searchObject;

    const subjects = subjectsInUrl.filter(
      subject => subject !== removedSubject,
    );
    this.onRemoveSubject({ subjects }, removedSubject);
  };

  onUpdateContextFilters = values => {
    const { updateSearchLocation } = this.props;
    updateSearchLocation({
      contextFilters: values,
    });
  };

  static getInitialProps = ctx => {
    const { client } = ctx;

    try {
      return runQueries(client, [
        {
          query: resourceTypesWithSubTypesQuery,
        },
        { query: subjectsWithFiltersQuery },
      ]);
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  getResourceTypes = stateSearchParams => {
    const { includeLearningPaths, data } = this.props;
    if (stateSearchParams.contextTypes) {
      return {
        contextTypes: stateSearchParams.contextTypes,
        resourceTypes: undefined,
        contextFilters: undefined,
      };
    }
    if (stateSearchParams.resourceTypes) {
      return {
        contextTypes: undefined,
        resourceTypes: stateSearchParams.resourceTypes,
      };
    }
    return !includeLearningPaths && data
      ? {
          resourceTypes: data.resourceTypes.map(type => type.id).join(','),
          contextTypes: undefined,
        }
      : {
          contextTypes: undefined,
          resourceTypes: undefined,
        };
  };

  updateFilter = searchParam => {
    const { updateSearchLocation } = this.props;
    const page = searchParam.page || 1;
    updateSearchLocation({
      ...searchParam,
      page,
    });
  };

  updateTab = (value, enabledTabs) => {
    const { updateSearchLocation } = this.props;
    const enabledTab = enabledTabs.find(tab => value === tab.value);
    const searchParams =
      !enabledTab || enabledTab.value === 'all'
        ? {}
        : { [enabledTab.type]: enabledTab.value };

    updateSearchLocation({
      contextTypes: undefined,
      resourceTypes: undefined,
      contextFilters: [],
      ...searchParams,
      page: 1,
    });
  };

  updateQuery = query => {
    this.setState({ query });
  };

  render() {
    const {
      t,
      locationSearchParams,
      data,
      loading,
      locale,
      searchObject,
      customResultList,
    } = this.props;
    if (loading) {
      return null;
    }
    const { subjects } = data;
    const { query } = this.state;

    const stateSearchParams = {};
    Object.keys(searchObject).forEach(key => {
      stateSearchParams[key] = convertSearchParam(searchObject[key]);
    });

    const searchParamsToGraphQL = {
      ...locationSearchParams,
      ...stateSearchParams,
      ...this.getResourceTypes(stateSearchParams),
    };

    const activeSubjectsMapped =
      subjects && subjects.length > 0
        ? searchObject.subjects
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

    const resourceTypeTabs =
      data && data.resourceTypes
        ? sortResourceTypes(data.resourceTypes).map(resourceType => ({
            value: resourceType.id,
            type: 'resourceTypes',
            name: resourceType.name,
          }))
        : [];

    const enabledTabs = [
      { value: 'all', name: t('contentTypes.all') },
      {
        value: 'topic-article',
        type: 'contextTypes',
        name: t('contentTypes.subject'),
      },
      ...resourceTypeTabs,
    ];

    const searchFilters = (
      <SearchFilters
        onChange={this.onFilterChange}
        filterState={searchObject}
        subjects={subjects}
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
    const enabledTab = searchObject.resourceTypes || searchObject.contextTypes;
    return (
      <Query
        asyncMode
        query={searchQuery}
        variables={searchParamsToGraphQL}
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
                results={
                  isReadyToShow
                    ? convertResult(
                        search.results,
                        searchObject.subjects,
                        enabledTab,
                        locale,
                      )
                    : []
                }
                resourceTypes={
                  data && data.resourceTypes ? data.resourceTypes : []
                }
                resultMetadata={resultMetadata}
                filterState={searchObject}
                enabledTabs={enabledTabs}
                onTabChange={this.updateTab}
                query={searchObject.query}
                onUpdateContextFilters={this.onUpdateContextFilters}
                customResultList={customResultList}
              />
              {isReadyToShow && (
                <Pager
                  page={searchObject.page ? parseInt(searchObject.page, 10) : 1}
                  lastPage={resultMetadata.lastPage}
                  query={searchObject}
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
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
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
  }),
  loading: PropTypes.bool.isRequired,
  locale: PropTypes.string,
  locationSearchParams: shape({
    languageFilter: string,
    contextTypes: string,
    page: string,
    resourceTypes: string,
    subject: string,
  }),
  searchObject: shape({
    contextFilters: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
    page: string,
    resourceTypes: string,
    subjects: arrayOf(string),
  }),
  updateSearchLocation: func,
  includeLearningPaths: bool,
  customResultList: func,
};

SearchContainer.defaultProps = {
  filters: [],
  subjects: [],
  locationSearchParams: {},
  searchObject: {},
  data: {},
  updateSearchLocation: () => {},
  includeLearningPaths: false,
};

export default injectT(SearchContainer);
