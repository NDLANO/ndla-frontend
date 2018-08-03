/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes, { func, number, string, arrayOf, shape } from 'prop-types';
import { compose } from 'redux';
import { SearchPage, OneColumn, Pager } from 'ndla-ui';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import {
  SubjectShape,
  ArticleResultShape,
  FilterShape,
  LocationShape,
} from '../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../graphqlShapes';
import { getResults, getResultsMetadata } from './searchSelectors';
import {
  getSubjects,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import {
  getFilters,
  getMultipeSubjectFilters,
  actions as filterActions,
} from '../Filters/filter';
import { getLocale } from '../Locale/localeSelectors';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { runQueries } from '../../util/runQueries';
import { resourceTypesWithSubTypesQuery } from '../../queries';
import handleError from '../../util/handleError';
import { sortResourceTypes } from '../Resources/getResourceGroups';

class SearchContainer extends Component {
  constructor(props) {
    super();
    const { location } = props;
    const searchObject = converSearchStringToObject(location);

    this.state = {
      searchParams: {
        page: searchObject.page || 1,
        query: searchObject.query || '',
        subjects: searchObject.subjects || [],
        'language-filter': searchObject['language-filter'] || [],
        levels: searchObject.levels || [],
        'resource-types': searchObject['resource-types'] || undefined,
        'context-types': searchObject['context-types'] || undefined,
        contextFilters: searchObject.contextFilters || [],
      },
    };
  }

  onQuerySubmit = evt => {
    evt.preventDefault();
    this.updateFilter({ query: this.state.searchParams.query });
  };

  onFilterChange = (newValues, value, type) => {
    if (
      type === 'subjects' &&
      newValues.length < this.state.searchParams.subjects.length
    ) {
      this.onRemoveSubject({ subjects: newValues }, value);
    } else {
      this.updateFilter({ [type]: newValues });
    }
  };

  onRemoveSubject = (subjectsSearchParam, subject) => {
    const { filters } = this.props;
    const { levels } = this.state.searchParams;
    const removedFilters = filters
      .filter(level => level.subjectId === subject)
      .map(level => level.name);

    this.setState(
      prevState => ({
        searchParams: {
          ...prevState.searchParams,
          ...subjectsSearchParam,
          levels: levels.filter(level => !removedFilters.includes(level)),
        },
      }),
      this.updateSearchLocation,
    );
  };

  onSearchFieldFilterRemove = removedSubject => {
    const subjects = this.state.searchParams.subjects.filter(
      subject => subject !== removedSubject,
    );
    this.onRemoveSubject({ subjects }, removedSubject);
  };

  onUpdateContextFilters = values => {
    this.setState(
      prevState => ({
        searchParams: {
          ...prevState.searchParams,
          contextFilters: values,
        },
      }),
      this.updateSearchLocation,
    );
  };

  static getInitialProps = ctx => {
    const {
      subjects,
      fetchSubjects,
      location,
      fetchFilters,
      filters,
      search,
      client,
    } = ctx;

    if (!subjects || subjects.length === 0) {
      fetchSubjects();
    }
    if (!filters || filters.length === 0) {
      fetchFilters();
    }

    const searchObject = location ? converSearchStringToObject(location) : {};

    const searchParams = {
      ...queryString.parse(location.search),
      'context-types': !searchObject.contextFilters
        ? searchObject['context-types']
        : undefined,
      'resource-types':
        searchObject.contextFilters || searchObject['resource-types'],
      contextFilters: undefined,
    };

    search({ searchString: `?${queryString.stringify(searchParams)}` });

    try {
      return runQueries(client, [
        {
          query: resourceTypesWithSubTypesQuery,
        },
      ]);
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  updateFilter = searchParam => {
    const page = searchParam.page || 1;
    this.setState(
      prevState => ({
        searchParams: { ...prevState.searchParams, ...searchParam, page },
      }),
      this.updateSearchLocation,
    );
  };

  updateTab = (value, enabledTabs) => {
    const enabledTab = enabledTabs.find(tab => value === tab.value);
    const searchParams =
      !enabledTab || enabledTab.value === 'all'
        ? {}
        : { [enabledTab.type]: enabledTab.value };

    this.setState(
      prevState => ({
        searchParams: {
          ...prevState.searchParams,
          'context-types': undefined,
          'resource-types': undefined,
          contextFilters: [],
          ...searchParams,
          page: 1,
        },
      }),
      this.updateSearchLocation,
    );
  };

  updateQuery = query => {
    this.setState(prevState => ({
      searchParams: { ...prevState.searchParams, query, page: 1 },
    }));
  };

  updateSearchLocation = () => {
    const { location, history, search } = this.props;
    const stateSearchParams = {};
    Object.keys(this.state.searchParams).forEach(key => {
      stateSearchParams[key] = convertSearchParam(this.state.searchParams[key]);
    });
    const searchParams = {
      ...queryString.parse(location.search),
      ...stateSearchParams,
      'context-types': !stateSearchParams.contextFilters
        ? stateSearchParams['context-types']
        : undefined,
      'resource-types':
        stateSearchParams.contextFilters || stateSearchParams['resource-types'],
      contextFilters: undefined,
    };

    const searchString = `?${queryString.stringify(searchParams)}`;
    search({ searchString });
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...stateSearchParams,
      }),
    });
  };

  render() {
    const {
      t,
      subjects,
      resultMetadata,
      filters,
      results,
      location,
      loading,
      data,
    } = this.props;

    if (loading) {
      return null;
    }

    const { searchParams } = this.state;
    const activeSubjectsMapped =
      subjects && subjects.length > 0
        ? searchParams.subjects.map(it => {
            const subject = subjects.find(s => s.id === it) || {};
            return {
              value: subject.id,
              title: subject.name,
              filterName: subject.name,
            };
          })
        : [];

    const resourceTypeTabs =
      data && data.resourceTypes
        ? sortResourceTypes(data.resourceTypes).map(resourceType => ({
            value: resourceType.id,
            type: 'resource-types',
            name: resourceType.name,
          }))
        : [];

    const enabledTabs = [
      { value: 'all', name: t('contentTypes.all') },
      {
        value: 'topic-article',
        type: 'context-types',
        name: t('contentTypes.subject'),
      },
      ...resourceTypeTabs,
    ];

    const searchFilters = (
      <SearchFilters
        onChange={this.onFilterChange}
        filterState={searchParams}
        subjects={subjects}
        filters={filters}
        enabledTabs={enabledTabs}
        onContentTypeChange={this.onTabChange}
      />
    );
    const searchPageMessages = {
      filterHeading: t('searchPage.searchPageMessages.filterHeading'),
      resultHeading: t('searchPage.searchPageMessages.resultHeading', {
        totalCount: resultMetadata.totalCount,
      }),
      dropdownBtnLabel: t('searchPage.searchPageMessages.dropdownBtnLabel'),
      closeButton: t('searchPage.close'),
      narrowScreenFilterHeading: t(
        'searchPage.searchPageMessages.narrowScreenFilterHeading',
        {
          totalCount: resultMetadata.totalCount,
          query: this.state.searchParams.query,
        },
      ),
      searchFieldTitle: t('searchPage.search'),
    };

    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchPage
          closeUrl="/#"
          searchString={searchParams.query || ''}
          onSearchFieldChange={e => this.updateQuery(e.target.value)}
          onSearch={this.onQuerySubmit}
          searchFieldPlaceholder={t('searchPage.searchFieldPlaceholder')}
          onSearchFieldFilterRemove={this.onSearchFieldFilterRemove}
          searchFieldFilters={activeSubjectsMapped}
          activeFilters={activeSubjectsMapped}
          onActiveFilterRemove={() => {}}
          messages={searchPageMessages}
          resourceToLinkProps={resourceToLinkProps}
          filters={searchFilters}>
          <SearchResults
            results={results}
            resourceTypes={data && data.resourceTypes ? data.resourceTypes : []}
            resultMetadata={resultMetadata}
            filterState={searchParams}
            enabledTabs={enabledTabs}
            onTabChange={this.updateTab}
            location={location}
            onUpdateContextFilters={this.onUpdateContextFilters}
          />
          <Pager
            page={searchParams.page ? parseInt(searchParams.page, 10) : 1}
            lastPage={resultMetadata.lastPage}
            query={this.state.searchParam}
            pathname=""
            onClick={this.updateFilter}
            pageItemComponentClass="button"
          />
        </SearchPage>
      </OneColumn>
    );
  }
}

SearchContainer.propTypes = {
  location: LocationShape,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  results: arrayOf(ArticleResultShape).isRequired,
  search: func.isRequired,
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
  locale: string.isRequired,
  loading: PropTypes.bool.isRequired,
  data: shape({
    resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  }),
};

SearchContainer.defaultProps = {
  filters: [],
  subjects: [],
};

const mapDispatchToProps = {
  search: actions.search,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchFilters: filterActions.fetchFilters,
};

const mapStateToProps = (state, ownProps) => {
  const { location } = ownProps;
  const searchObject = converSearchStringToObject(location);
  return {
    results: getResults(state),
    resultMetadata: getResultsMetadata(state),
    subjects: getSubjects(state),
    locale: getLocale(state),
    filters:
      searchObject.subjects.length > 0
        ? getMultipeSubjectFilters(searchObject.subjects)(state)
        : getFilters('filters')(state),
  };
};

export default compose(
  withRouter,
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
