/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { func, number, string, arrayOf, shape } from 'prop-types';
import { compose } from 'redux';
import { SearchPage, OneColumn, Pager } from 'ndla-ui';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import { SubjectShape, ArticleResultShape, FilterShape } from '../../shapes';
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

class SearchContainer extends Component {
  static getInitialProps = ctx => {
    const {
      subjects,
      fetchSubjects,
      location,
      fetchFilters,
      filters,
      search,
    } = ctx;

    if (!subjects || subjects.length === 0) {
      fetchSubjects();
    }
    if (!filters || filters.length === 0) {
      fetchFilters();
    }

    const searchString = location ? location.search : '';
    search({ searchString });
  };

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

  updateFilter = searchParam => {
    const page = searchParam.page || 1;
    this.setState(
      prevState => ({
        searchParams: { ...prevState.searchParams, ...searchParam, page },
      }),
      this.updateSearchLocation,
    );
  };

  updateTab = value => {
    const { enabledTabs } = this.props;
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
    };

    const searchString = `?${queryString.stringify(searchParams)}`;

    search({ searchString });
    history.push({
      pathname: '/search',
      search: searchString,
    });
  };

  render() {
    const {
      t,
      enabledTabs,
      subjects,
      resultMetadata,
      filters,
      results,
    } = this.props;

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
      closeButton: t('searchPage.close'),
      narrowScreenFilterHeading: t(
        'searchPage.searchPageMessages.narrowScreenFilterHeading',
        { totalCount: resultMetadata.totalCount, query: this.state.query },
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
            resultMetadata={resultMetadata}
            filterState={this.state.searchParams}
            enabledTabs={enabledTabs}
            onTabChange={this.updateTab}
          />
          <Pager
            page={
              this.state.searchParams.page
                ? parseInt(this.state.searchParams.page, 10)
                : 1
            }
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
  location: shape({
    search: string,
  }).isRequired,
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
};

SearchContainer.defaultProps = {
  enabledTabs: [
    { value: 'all', name: 'all' },
    { value: 'topic-article', type: 'context-types', name: 'subject' },
    {
      value: 'urn:resourcetype:subjectMaterial',
      type: 'resource-types',
      name: 'subject-material',
    },
    {
      value: 'urn:resourcetype:learningPath',
      type: 'resource-types',
      name: 'learning-path',
    },
    {
      value: 'urn:resourcetype:externalResource',
      type: 'resource-types',
      name: 'external-learning-resources',
    },
  ],
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
