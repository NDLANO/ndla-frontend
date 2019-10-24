/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import { func, number, string, shape, arrayOf, bool } from 'prop-types';

import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { runQueries } from '../../util/runQueries';
import {
  resourceTypesWithSubTypesQuery,
  subjectsWithFiltersQuery,
} from '../../queries';
import { LocationShape } from '../../shapes';
import SearchContainer from './SearchContainer';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import handleError from '../../util/handleError';
import { sortResourceTypes } from '../Resources/getResourceGroups';
import {
  GraphqlResourceTypeWithsubtypesShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';

const ALL_TAB_VALUE = 'all';

class SearchPage extends Component {
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

  updateSearchLocation = searchParams => {
    const { history, location } = this.props;
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
    const { location, t, data, loading, ...rest } = this.props;
    if (loading) {
      return null;
    }
    const searchParams = converSearchStringToObject(location);
    const resourceTypeTabs =
      data && data.resourceTypes
        ? sortResourceTypes(data.resourceTypes).map(resourceType => ({
            value: resourceType.id,
            type: 'resourceTypes',
            name: resourceType.name,
          }))
        : [];

    const enabledTabs = [
      { value: ALL_TAB_VALUE, name: t('contentTypes.all') },
      {
        value: 'topic-article',
        type: 'contextTypes',
        name: t('contentTypes.subject'),
      },
      ...resourceTypeTabs,
    ];

    return (
      <Fragment>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <OneColumn cssModifier="clear-desktop" wide>
          <SearchContainer
            searchParams={searchParams}
            handleSearchParamsChange={this.updateSearchLocation}
            data={data}
            enabledTabs={enabledTabs}
            allTabValue={ALL_TAB_VALUE}
            {...rest}
          />
        </OneColumn>
      </Fragment>
    );
  }
}

SearchPage.propTypes = {
  location: LocationShape,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  resultMetadata: shape({
    totalCount: number,
    lastPage: number,
  }),
  data: shape({
    resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
    subjects: arrayOf(GraphQLSubjectShape),
  }),
  match: shape({
    params: shape({
      subjectId: string,
    }),
  }),
  loading: bool.isRequired,
};

export default injectT(withRouter(SearchPage));
