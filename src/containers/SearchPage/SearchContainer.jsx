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
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import { SubjectShape, ArticleResultShape } from '../../shapes';
import {
  getResults,
  getLastPage,
  getSearching,
  getFilterState,
} from './searchSelectors';
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
      location,
      search,
      subject,
      subjectId,
      fetchSubjectFilters,
      fetchSubjects,
    } = ctx;
    if (location && location.search) {
      search(location.search);
    }
    if (!subject) {
      fetchSubjects();
      if (subjectId) fetchSubjectFilters(subjectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { filterState: { query } } = nextProps;
    if (query !== this.props.filterState.query) {
      this.props.search(query);
    }
  }

  onFilterChange = (newValues, type) => {
    this.props.updateFilter({
      [type]: newValues,
    });
  };

  render() {
    const {
      results,
      updateFilter,
      filterState,
      t,
      enabledTabs,
      subject,
      subjects,
      levelFilters,
    } = this.props;
    const activeSubjects = Array.isArray(filterState.subject)
      ? filterState.subject
      : [];
    const ActiveSubjectsMapped = subjects
      .filter(it => activeSubjects.indexOf(it.id) > -1)
      .map(sub => ({
        value: sub.id,
        title: sub.name,
      }));

    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchPage
          closeUrl="#"
          searchString={filterState.query || ''}
          onSearchFieldChange={e => updateFilter({ query: e.target.value })}
          searchFieldPlaceholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
          onSearchFieldFilterRemove={val =>
            updateFilter({
              subject: filterState.subject.filter(it => it !== val),
            })
          }
          searchFieldFilters={
            // this needs to always be the active subjects in state, and rather insert into state the subject at mounting
            subject
              ? [
                  {
                    value: subject.id,
                    title: subject.name,
                  },
                ]
              : ActiveSubjectsMapped
          }
          activeFilters={ActiveSubjectsMapped}
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
              title: t(`searchPage.${it}`),
            }))}
            onTabChange={tab => updateFilter({ currentTab: tab })}
            currentTab={filterState.currentTab}>
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
  updateFilter: func,
  filterState: shape({
    subject: arrayOf(string),
    activeTab: string,
  }),
};

SearchContainer.defaultProps = {
  enabledTabs: [
    'all',
    'subject',
    'subjectMaterial',
    'learningPath',
    'externalLearningResources',
  ],
};

const mapDispatchToProps = {
  search: actions.search,
  clearSearchResult: actions.clearSearchResult,
  updateFilter: actions.updateFilter,
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
    filterState: getFilterState(state),
    subject: getSubjectById(subjectId)(state),
    subjects: getSubjects(state),
    levelFilters: getFilters(subjectId)(state),
  };
};

export default compose(
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
