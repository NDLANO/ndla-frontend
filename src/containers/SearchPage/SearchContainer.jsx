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
import { SubjectShape, ArticleResultShape } from '../../shapes';
import { getResults, getLastPage, getSearching } from './searchSelectors';
import { actions as topicActions } from '../TopicPage/topic';
import {
  getSubjectById,
  getSubjects,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getFilters, actions as filterActions } from '../Filters/filter';
import SearchFilters from './components/SearchFilters';
import getContentTypeFromResourceTypes from '../../util/getContentTypeFromResourceTypes';

class SearchContainer extends Component {
  static getInitialProps(ctx) {
    const {
      subjects,
      subjectId,
      fetchSubjectFilters,
      fetchSubjects,
      location,
      search,
    } = ctx;
    if (!subjects) {
      fetchSubjects();
      if (subjectId) fetchSubjectFilters(subjectId);
    }
    search(queryString.parse(location.search));
  }

  state = {
    query: '',
  };

  onFilterChange = (newValues, type) => {
    this.updateFilter({
      [type]: newValues,
    });
  };

  updateFilter = obj => {
    const { location, history } = this.props;
    const newSearch = {
      ...queryString.parse(location.search),
      ...obj,
    }; // filter out empty keys?
    history.push({
      search: queryString.stringify(newSearch),
      state: location.state,
    });
  };

  toArray = input => [
    ...(Array.isArray(input) ? input : [input].filter(it => it !== undefined)),
  ];

  render() {
    const { results, t, enabledTabs, location, subjects } = this.props;
    const stateFromUrl = queryString.parse(location.search);
    const filterState = {
      ...stateFromUrl,
      subject: this.toArray(stateFromUrl.subject),
      language: this.toArray(stateFromUrl.language),
      content: this.toArray(stateFromUrl.content),
      level: this.toArray(stateFromUrl.level),
    };

    const ActiveSubjectsMapped = filterState.subject.map(it => {
      const subj = subjects.find(s => s.id === it) || {};
      return {
        value: subj.id,
        title: subj.name,
      };
    });
    const allActiveFilters = [...ActiveSubjectsMapped];
    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchPage
          closeUrl="#"
          searchString={this.state.query}
          onSearchFieldChange={e => this.setState({ query: e.target.value })}
          onSearch={() => this.updateFilter({ query: this.state.query })}
          searchFieldPlaceholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
          onSearchFieldFilterRemove={val =>
            this.updateFilter({
              subject: filterState.subject.filter(it => it !== val),
            })
          }
          searchFieldFilters={ActiveSubjectsMapped}
          activeFilters={allActiveFilters}
          onActiveFilterRemove={() => {}}
          messages={{
            filterHeading: 'Filter',
            resultHeading: '43 treff i Ndla',
            closeButton: 'Lukk',
            narrowScreenFilterHeading: '10 treff på «ideutvikling»',
            searchFieldTitle: 'Søk',
          }}
          filters={
            <SearchFilters
              onChange={this.onFilterChange}
              filterState={filterState}
              subjects={subjects}
              enabledTabs={enabledTabs}
              t={t}
            />
          }>
          <SearchResult
            messages={{
              searchStringLabel: 'Du søkte på:',
              subHeading: '43 treff i Ndla',
            }}
            searchString={filterState.query}
            tabOptions={enabledTabs.map(it => ({
              value: it,
              title: t(`contentTypes.${it}`),
            }))}
            onTabChange={tab => this.updateFilter({ currentTab: tab })}
            currentTab={filterState.currentTab || 'all'}>
            <SearchResultList
              messages={{
                subjectsLabel: 'Åpne i fag:',
                noResultHeading: 'Hmm, ikke noe innhold ...',
                noResultDescription:
                  'Vi har dessverre ikke noe å tilby her. Hvis du vil foreslå noe innhold til dette området, kan du bruke Spør NDLA som du finner nede til høyre på skjermen.',
              }}
              results={results}
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
};

SearchContainer.defaultProps = {
  enabledTabs: [
    'all',
    'topic',
    'subjectMaterial',
    'learningPath',
    'externalLearningResources',
  ],
};

const mapDispatchToProps = {
  search: actions.search,
  clearSearchResult: actions.clearSearchResult,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  fetchTopicsWithIntroductions: topicActions.fetchTopicsWithIntroductions,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId } = ownProps.match.params;
  return {
    results: getResults(state),
    lastPage: getLastPage(state),
    searching: getSearching(state),
    subject: getSubjectById(subjectId)(state),
    subjects: getSubjects(state),
    levelFilters: getFilters(subjectId)(state),
  };
};

export default compose(
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
