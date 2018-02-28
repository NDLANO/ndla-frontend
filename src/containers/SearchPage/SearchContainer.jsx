/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { bool, func, number, string, arrayOf, shape } from 'prop-types';
import { compose } from 'redux';
import { SearchPage, SearchResult, SearchResultList, OneColumn } from 'ndla-ui';
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import { ArticleResultShape } from '../../shapes';
import {
  getResults,
  getLastPage,
  getSearching,
  getFilterState,
} from './searchSelectors';
import { getSubjectById } from '../SubjectPage/subjects';
import SelectSearchSortOrder from './components/SelectSearchSortOrder';
import { toSearch, getUrnIdsFromProps } from '../../routeHelpers';
import { createQueryString, parseQueryString } from '../../util/queryHelpers';
import { getFilters } from '../Filters/filter';
import SearchFilters from './components/SearchFilters';

class SearchContainer extends Component {
  static getInitialProps(ctx) {
    const { location, search } = ctx;
    if (location && location.search) {
      search(location.search);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { filterState: { query } } = nextProps;
    if (query !== this.props.filterState.query) {
      this.props.search(query);
    }
  }

  render() {
    const {
      results,
      updateFilter,
      filterState,
      t,
      enabledTabs,
      subject,
    } = this.props;
    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchPage
          closeUrl="#"
          searchString={filterState.query}
          onSearchFieldChange={e => updateFilter({ query: e.target.value })}
          searchFieldPlaceholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
          onSearchFieldFilterRemove={(val, name) => {}}
          searchFieldFilters={
            subject
              ? [
                  {
                    value: subject.id,
                    title: subject.name,
                  },
                ]
              : undefined
          }
          activeFilters={filterState.activeFilters}
          onActiveFilterRemove={() => {}}
          messages={{
            filterHeading: 'Filter',
            resultHeading: '43 treff i Ndla',
            closeButton: 'Lukk',
            narrowScreenFilterHeading: '10 treff på «ideutvikling»',
            searchFieldTitle: 'Søk',
          }}
          filters={<SearchFilters />}>
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
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId } = getUrnIdsFromProps(ownProps);
  return {
    results: getResults(state),
    lastPage: getLastPage(state),
    searching: getSearching(state),
    filterState: getFilterState(state),
    subject: getSubjectById(subjectId)(state),
  };
};

export default compose(
  injectT,
  connectSSR(mapStateToProps, mapDispatchToProps),
)(SearchContainer);
