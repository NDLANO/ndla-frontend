/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import {
  bool,
  func,
  number,
  string,
  arrayOf,
  objectOf,
  shape,
} from 'prop-types';
import { compose } from 'redux';
import { SearchPage, OneColumn } from 'ndla-ui';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import { SubjectShape, ArticleResultShape, FilterShape } from '../../shapes';
import {
  getResults,
  getLastPage,
  getSearching,
  getResultsMetadata,
} from './searchSelectors';
import { actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
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

const getSubjetcsArray = (location, subjectId = undefined) => {
  const searchObjectSubjects = queryString.parse(location.search).subjects
    ? queryString.parse(location.search).subjects.split(',')
    : [];
  if (subjectId && searchObjectSubjects.length > 0) {
    return [subjectId, ...searchObjectSubjects];
  } else if (subjectId) {
    return [subjectId];
  } else if (searchObjectSubjects.length > 0) {
    return searchObjectSubjects;
  }
  return [];
};

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
    const { match: { params: { subjectId } }, location } = props;
    const searchObject = this.converSearchStringToObject(location);
    const subjects = getSubjetcsArray(location, subjectId);
    this.state = {
      searchParams: {
        query: searchObject.query || '',
        subjects: subjects || [],
        'language-filter': searchObject['language-filter'] || [],
        levels: searchObject.levels || [],
        'resource-types': undefined,
      },
    };
  }

  componentDidMount() {
    SearchContainer.getInitialProps(this.props);
  }

  onQuerySubmit = evt => {
    evt.preventDefault();
    this.updateFilter({ query: this.state.searchParams.query });
  };

  onFilterChange = (newValues, value, type) => {
    if (type === 'subjects' && newValues.length < this.state.searchParams.subjects.length) {
      this.onRemoveSubject({ subjects: newValues  }, value);
    } else {
      this.updateFilter({ [type]: newValues  });
    }
  };

  onRemoveSubject = (subjectsSearchParam, subject) => {
    const { filters } = this.props;
    const { levels } = this.state.searchParams;
    const removedFilters = filters.filter(level => level.subjectId === subject).map(level => level.name);
    this.setState((prevState) => ({searchParams: { ...prevState.searchParams, ...subjectsSearchParam,  levels: levels.filter(level => !removedFilters.includes(level))}}), this.updateSearchLocation)
  }

  onSearchFieldFilterRemove = removedSubject => {
    this.onRemoveSubject(removedSubject);
    const subjects = this.state.searchParams.subjects.filter(
      subject => subject !== removedSubject,
    );
    this.onRemoveSubject({ subjects }, removedSubject);
  };

  converSearchStringToObject = location => {
    const arrayFields = ['language-filter', 'levels'];
    const searchLocation = queryString.parse(location ? location.search : '');

    return {
      ...searchLocation,
      ...arrayFields
        .map(field => ({
          [field]: searchLocation[field]
            ? searchLocation[field].split(',')
            : [],
        }))
        .reduce((result, item) => {
          const key = Object.keys(item)[0];
          return { ...result, [key]: item[key] };
        }),
    };
  };

  updateFilter = searchParam => {
    this.setState(
      prevState => ({
        searchParams: { ...prevState.searchParams, ...searchParam },
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
        },
      }),
      this.updateSearchLocation,
    );
  };


  updateQuery = query => {
    this.setState(prevState => ({
      searchParams: { ...prevState.searchParams, query },
    }));
  };

  convertSearchParam = value => {
    if (!value) {
      return undefined;
    } else if (Array.isArray(value)) {
      return value.length > 0 ? value.join(',') : undefined;
    }
    return value.length > 0 ? value : undefined;
  };

  updateSearchLocation = () => {
    const { location, history, search } = this.props;
    const stateSearchParams = {};
    Object.keys(this.state.searchParams).forEach(key => {
      stateSearchParams[key] = this.convertSearchParam(
        this.state.searchParams[key],
      );
    });

    const searchParams = {
      ...queryString.parse(location.search),
      ...stateSearchParams,
    };

    search({ searchString: `?${queryString.stringify(searchParams)}` });

    history.push({
      search: queryString.stringify(searchParams),
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
      closeButton: t('searchPage.searchPageMessages.closeButton'),
      narrowScreenFilterHeading: t(
        'searchPage.searchPageMessages.narrowScreenFilterHeading',
        { totalCount: resultMetadata.totalCount, query: this.state.query },
      ),
      searchFieldTitle: t('searchPage.searchPageMessages.searchFieldTitle'),
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
  clearSearchResult: func.isRequired,
  lastPage: number.isRequired,
  results: arrayOf(ArticleResultShape).isRequired,
  searching: bool.isRequired,
  search: func.isRequired,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  subject: SubjectShape,
  subjects: arrayOf(SubjectShape),
  levelFilters: arrayOf(objectOf(string)),
  resultMetadata: shape({
    totalCount: number,
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
  clearSearchResult: actions.clearSearchResult,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  fetchFilters: filterActions.fetchFilters,
  fetchTopicsWithIntroductions: topicActions.fetchTopicsWithIntroductions,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { subjectId } }, location } = ownProps;
  const subjects = getSubjetcsArray(location, subjectId);
  return {
    results: getResults(state),
    lastPage: getLastPage(state),
    resultMetadata: getResultsMetadata(state),
    searching: getSearching(state),
    subject: getSubjectById(subjectId)(state),
    subjects: getSubjects(state),
    locale: getLocale(state),
    filters:
      subjects.length > 0
        ? getMultipeSubjectFilters(subjects)(state)
        : getFilters('filters')(state),
    levelFilters: getFilters(subjectId)(state),
  };
};

export default compose(
  withRouter,
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
