/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useState } from 'react';
import { func, number, string, shape } from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import { searchPageQuery, groupSearchQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import SearchContainer from './SearchContainer';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { sortResourceTypes } from '../Resources/getResourceGroups';
import { useGraphQuery } from '../../util/runQueries';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from '../../constants';

const ALL_TAB_VALUE = 'all';

const resourceTypes = `
  ${RESOURCE_TYPE_SUBJECT_MATERIAL},
  ${RESOURCE_TYPE_LEARNING_PATH},
  ${RESOURCE_TYPE_TASKS_AND_ACTIVITIES}
`;

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

  const [params, setParams] = useState({
    page: 1,
    pageSize: 4,
    resourceTypes
  })
  const { loading, data } = useGraphQuery(searchPageQuery);
  const { data: searchData, loadingSearch, searchError } = useGraphQuery(
    groupSearchQuery,
    {
      variables: {
        ...stateSearchParams,
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
        resourceTypes: params.resourceTypes || resourceTypes
      },
    },
  );

  if (loading || loadingSearch) {
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
      name: t('contentTypes.topic'),
    },
    ...resourceTypeTabs,
  ];

  const enabledTab =
    stateSearchParams.resourceTypes ||
    stateSearchParams.contextTypes ||
    ALL_TAB_VALUE;

  const subjects = searchSubjects(searchParams.query);
  const subjectGroup = {
    type: 'subject',
    resources: subjects,
    totalCount: subjects.length,
  }

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchContainer
          searchParams={searchParams}
          handleSearchParamsChange={handleSearchParamsChange}
          data={data}
          enabledTabs={enabledTabs}
          enabledTab={enabledTab}
          allTabValue={ALL_TAB_VALUE}
          loading={loadingSearch}
          error={searchError}
          searchData={[...searchData.groupSearch, subjectGroup]}
          setParams={setParams}
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
