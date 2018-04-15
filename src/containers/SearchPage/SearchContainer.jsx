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
import {
  SearchPage,
  SearchResult,
  SearchResultList,
  OneColumn,
  ContentTypeBadge,
} from 'ndla-ui';
import queryString from 'query-string';
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

import {
  getFilters,
  getMultipeSubjectFilters,
  actions as filterActions,
} from '../Filters/filter';
import SearchFilters from './components/SearchFilters';

const defaultState = {
  searchParams: {
    query: '',
    subjects: [],
    'language-filter': [],
    levels: [],
    'resource-types': 'all',
  },
};

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
  static getInitialProps(ctx) {
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
  }

  state = defaultState;

  componentWillMount() {
    SearchContainer.getInitialProps(this.props);

    const { match: { params: { subjectId } }, location } = this.props;
    const searchObject = this.converSeacrhStringToObject();

    this.setState({
      searchParams: {
        ...searchObject,
        subjects: getSubjetcsArray(location, subjectId),
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: nextLocation } = nextProps;
    const { location, search } = this.props;
    if (nextLocation && location && location !== nextLocation) {
      search(nextLocation.search);
    }
  }

  onFilterChange = (newValues, type) => {
    this.setState(prevState => ({
      searchParams: { ...prevState.searchParams, [type]: newValues },
    }));

    const searchParam = {
      [type]: newValues.join(','),
    };
    this.updateSearchLocation(searchParam);
  };

  converSeacrhStringToObject = () => {
    const { location } = this.props;
    const arrayFields = ['language-filter', 'levels'];
    const searchLocation = queryString.parse(location ? location.search : '');

    return arrayFields
      .map(field => ({
        [field]: searchLocation[field] ? searchLocation[field].split(',') : [],
      }))
      .reduce((result, item) => {
        const key = Object.keys(item)[0];
        return { ...result, [key]: item[key] };
      });
  };

  updateFilter = searchParam => {
    this.setState(prevState => ({
      searchParams: { ...prevState.searchParams, ...searchParam },
    }));
    this.updateSearchLocation(searchParam);
  };

  updateQuery = query => {
    this.setState(prevState => ({
      searchParams: { ...prevState.searchParams, query },
    }));
  };

  updateSearchLocation = searchParam => {
    const { location, history } = this.props;
    const searchParams = {
      ...queryString.parse(location.search),
      ...searchParam,
    };
    history.push({
      search: queryString.stringify(searchParams),
    });
  };

  toArray = input => [
    ...(Array.isArray(input) ? input : [input].filter(it => it !== undefined)),
  ];

  render() {
    const {
      results,
      t,
      enabledTabs,
      location,
      subjects,
      resultMetadata,
      filters,
    } = this.props;
    const stateFromUrl = queryString.parse(location.search);

    const filterState = {
      ...this.state.searchParams,
      content: this.toArray(stateFromUrl.content),
    };

    const activeSubjectsMapped = filterState.subjects.map(it => {
      const subject = subjects.find(s => s.id === it) || {};
      return {
        value: subject.id,
        title: subject.name,
      };
    });

    const allActiveFilters = [...activeSubjectsMapped];
    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchPage
          closeUrl="/#"
          searchString={filterState.query}
          onSearchFieldChange={e => this.updateQuery(e.target.value)}
          onSearch={() => this.updateFilter({ query: filterState.query })}
          searchFieldPlaceholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
          onSearchFieldFilterRemove={removedSubject =>
            this.updateFilter({
              subjects: filterState.subjects.filter(
                subject => subject !== removedSubject,
              ),
            })
          }
          searchFieldFilters={activeSubjectsMapped}
          activeFilters={allActiveFilters}
          onActiveFilterRemove={() => {}}
          messages={{
            filterHeading: 'Filter',
            resultHeading: `${resultMetadata.totalCount} treff i Ndla`,
            closeButton: 'Lukk',
            narrowScreenFilterHeading: '10 treff på «ideutvikling»',
            searchFieldTitle: 'Søk',
          }}
          filters={
            <SearchFilters
              onChange={this.onFilterChange}
              filterState={filterState}
              subjects={subjects}
              filters={filters}
              enabledTabs={enabledTabs}
            />
          }>
          <SearchResult
            messages={{
              searchStringLabel: 'Du søkte på:',
              subHeading: `${resultMetadata.totalCount} treff i Ndla`,
            }}
            searchString={filterState.query}
            tabOptions={enabledTabs.map(it => ({
              value: it,
              title: t(`contentTypes.${it}`),
            }))}
            onTabChange={tab => this.updateFilter({ 'resource-types': tab })}
            currentTab={filterState['resource-types'] || 'all'}>
            <SearchResultList
              messages={{
                subjectsLabel: 'Åpne i fag:',
                noResultHeading: 'Hmm, ikke noe innhold ...',
                noResultDescription:
                  'Vi har dessverre ikke noe å tilby her. Hvis du vil foreslå noe innhold til dette området, kan du bruke Spør NDLA som du finner nede til høyre på skjermen.',
              }}
              results={results.map(result => ({
                ...result,
                contentTypeIcon: (
                  <ContentTypeBadge type={result.contentType} size="x-small" />
                ),
                contentTypeLabel: t(`contentTypes.${result.contentType}`),
              }))}
            />
          </SearchResult>
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
  enabledTabs: arrayOf(string),
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
};

SearchContainer.defaultProps = {
  enabledTabs: [
    'all',
    'subject',
    'subject-material',
    'learning-path',
    'external-learning-resources',
  ],
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
    filters:
      subjects.length > 0
        ? getMultipeSubjectFilters(subjects)(state)
        : getFilters('filters')(state),
    levelFilters: getFilters(subjectId)(state),
  };
};

export default compose(
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
