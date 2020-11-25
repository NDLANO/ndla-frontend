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
import { withRouter } from 'react-router-dom';

import { groupSearchQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import SearchContainer from './SearchContainer';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from '../../constants';

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

const SearchPage = ({ location, locale, history, t }) => {
  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 4,
    resourceTypes
  })
  const { data, loading, error } = useGraphQuery(
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

  const subjects = searchSubjects(searchParams.query);
  const subjectGroup = {
    type: 'subject',
    resources: subjects,
    totalCount: subjects.length,
  };
  const searchData = [
    ...(data ? data.groupSearch : []),
    subjectGroup
  ];

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchContainer
          error={error}
          history={history}
          loading={loading}
          searchData={searchData}
          searchParams={searchParams}
          setParams={setParams}
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
