/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, number, string, shape } from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn, FFHeroBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import { searchPageQuery, searchQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import SearchContainer from './SearchContainer';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { sortResourceTypes } from '../Resources/getResourceGroups';
import { useGraphQuery } from '../../util/runQueries';
import config from '../../config';

const ALL_TAB_VALUE = 'all';

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchPage = ({ location, locale, history, t, ...rest }) => {
  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);

  const { loading, data } = useGraphQuery(searchPageQuery);
  const { data: searchData, loadingSearch, searchError } = useGraphQuery(
    searchQuery,
    {
      variables: stateSearchParams,
    },
  );

  if (loading) {
    return null;
  }

  const handleSearchParamsChange = searchParams => {
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams(searchParams),
      }),
    });
  };

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

  const enabledTab =
    stateSearchParams.resourceTypes ||
    stateSearchParams.contextTypes ||
    ALL_TAB_VALUE;

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        {config.isFFServer && <FFHeroBadge isSearchPage noMargin />}
        <SearchContainer
          searchParams={searchParams}
          handleSearchParamsChange={handleSearchParamsChange}
          data={data}
          enabledTabs={enabledTabs}
          enabledTab={enabledTab}
          allTabValue={ALL_TAB_VALUE}
          loading={loadingSearch}
          error={searchError}
          searchData={searchData}
          {...rest}
        />
      </OneColumn>
    </Fragment>
  );
};

SearchPage.propTypes = {
  location: LocationShape,
  locale: string,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  resultMetadata: shape({
    totalCount: number,
    lastPage: number,
  }),
  match: shape({
    params: shape({
      subjectId: string,
    }),
  }),
};

export default injectT(withRouter(SearchPage));
