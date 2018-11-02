/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { func, number, string, arrayOf, shape } from 'prop-types';
import { compose } from 'redux';
import Pager from 'ndla-pager';
import { SearchPage, OneColumn } from 'ndla-ui';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from 'ndla-tracker';
import { injectT } from 'ndla-i18n';
import { Query } from 'react-apollo';
import connectSSR from '../../components/connectSSR';
import * as actions from './searchActions';
import { SubjectShape, FilterShape, LocationShape } from '../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../graphqlShapes';
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
  convertResult,
  getResultMetadata,
} from './searchHelpers';
import { runQueries } from '../../util/runQueries';
import { searchQuery, resourceTypesWithSubTypesQuery } from '../../queries';
import handleError from '../../util/handleError';
import { sortResourceTypes } from '../Resources/getResourceGroups';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    const searchObject = converSearchStringToObject(props.location);
    this.state = {
      query: searchObject.query || '',
    };
  }

  onQuerySubmit = evt => {
    evt.preventDefault();
    this.updateFilter({ query: this.state.query });
  };

  onFilterChange = (newValues, value, type, location) => {
    const { subjects } = converSearchStringToObject(location);
    if (type === 'subjects' && newValues.length < subjects.length) {
      this.onRemoveSubject({ subjects: newValues }, value);
    } else {
      this.updateFilter({ [type]: newValues });
    }
  };

  onRemoveSubject = (subjectsSearchParam, subject) => {
    const { filters, location } = this.props;
    const { levels } = converSearchStringToObject(location);
    const removedFilters = filters
      .filter(level => level.subjectId === subject)
      .map(level => level.name);

    this.updateSearchLocation({
      ...subjectsSearchParam,
      levels: levels.filter(level => !removedFilters.includes(level)),
    });
  };

  onSearchFieldFilterRemove = removedSubject => {
    const { subjects: subjectsInUrl } = converSearchStringToObject(
      this.props.location,
    );
    const subjects = subjectsInUrl.filter(
      subject => subject !== removedSubject,
    );
    this.onRemoveSubject({ subjects }, removedSubject);
  };

  onUpdateContextFilters = values => {
    this.updateSearchLocation({
      contextFilters: values,
    });
  };

  static getInitialProps = ctx => {
    const { subjects, fetchSubjects, fetchFilters, filters, client } = ctx;

    if (!subjects || subjects.length === 0) {
      fetchSubjects();
    }
    if (!filters || filters.length === 0) {
      fetchFilters();
    }

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

    this.updateSearchLocation({
      ...searchParam,
      page,
    });
  };

  updateTab = (value, enabledTabs) => {
    const enabledTab = enabledTabs.find(tab => value === tab.value);
    const searchParams =
      !enabledTab || enabledTab.value === 'all'
        ? {}
        : { [enabledTab.type]: enabledTab.value };

    this.updateSearchLocation({
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

  updateSearchLocation = searchParams => {
    const { location, history } = this.props;
    const stateSearchParams = {};
    Object.keys(searchParams).forEach(key => {
      stateSearchParams[key] = convertSearchParam(searchParams[key]);
    });

    history.push({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...stateSearchParams,
      }),
    });
  };

  render() {
    const { t, subjects, filters, location, data } = this.props;
    const { query } = this.state;

    const searchObject = converSearchStringToObject(location);

    const stateSearchParams = {};
    Object.keys(searchObject).forEach(key => {
      stateSearchParams[key] = convertSearchParam(searchObject[key]);
    });

    const searchParamsToGraphQL = {
      ...queryString.parse(location.search),
      ...stateSearchParams,
      contextTypes: !stateSearchParams.contextFilters
        ? stateSearchParams.contextTypes
        : undefined,
      resourceTypes:
        stateSearchParams.contextFilters || stateSearchParams.resourceTypes,
      contextFilters: undefined,
    };

    const activeSubjectsMapped =
      subjects && subjects.length > 0
        ? searchObject.subjects
            .map(it => {
              const subject = subjects.find(s => s.id === it);
              return subject
                ? {
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
        filters={filters}
        enabledTabs={enabledTabs}
        onContentTypeChange={this.onTabChange}
      />
    );
    const searchPageMessages = {
      filterHeading: t('searchPage.searchPageMessages.filterHeading'),

      dropdownBtnLabel: t('searchPage.searchPageMessages.dropdownBtnLabel'),
      closeButton: t('searchPage.close'),
      narrowScreenFilterHeading: t(
        'searchPage.searchPageMessages.narrowScreenFilterHeading',
        {
          totalCount: 1,
          query,
        },
      ),
      searchFieldTitle: t('searchPage.search'),
    };
    return (
      <OneColumn cssModifier="clear-desktop" wide>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <Query
          asyncMode
          query={searchQuery}
          variables={searchParamsToGraphQL}
          ssr={false}>
          {({ error, data: searchData }) => {
            if (error) {
              handleError(error);
              return `Error: ${error.message}`;
            }
            const { search } = searchData || {};
            const resultMetadata = search ? getResultMetadata(search) : {};
            return (
              <SearchPage
                closeUrl="/#"
                searchString={query || ''}
                onSearchFieldChange={e => this.updateQuery(e.target.value)}
                onSearch={this.onQuerySubmit}
                onSearchFieldFilterRemove={this.onSearchFieldFilterRemove}
                searchFieldFilters={activeSubjectsMapped}
                activeFilters={activeSubjectsMapped}
                messages={searchPageMessages}
                resourceToLinkProps={resourceToLinkProps}
                filters={searchFilters}>
                <SearchResults
                  results={
                    search &&
                    convertResult(search.results, searchObject.subjects)
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
                />
                {search && (
                  <Pager
                    page={
                      searchObject.page ? parseInt(searchObject.page, 10) : 1
                    }
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
      </OneColumn>
    );
  }
}

SearchContainer.propTypes = {
  location: LocationShape,
  history: shape({
    push: func.isRequired,
  }).isRequired,
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
