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
  getTypeFilter,
  updateSearchGroups,
  getTypeParams,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../../constants';

const resourceTypes = `
  ${RESOURCE_TYPE_SUBJECT_MATERIAL},
  ${RESOURCE_TYPE_LEARNING_PATH},
  ${RESOURCE_TYPE_TASKS_AND_ACTIVITIES},
  ${RESOURCE_TYPE_ASSESSMENT_RESOURCES},
  ${RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES},
  ${RESOURCE_TYPE_SOURCE_MATERIAL}
`;
const contextTypes = 'topic-article';

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchPage = ({ location, locale, history, t }) => {
  const { loading, data } = useGraphQuery(searchPageQuery);

  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter());
  const [searchGroups, setSearchGroups] = useState([]);
  const [replaceItems, setReplaceItems] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 4,
    types: null,
  });
  const { data: searchData, error } = useGraphQuery(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...getTypeParams(params.types, resourceTypes, contextTypes),
    },
    onCompleted: data => {
      setSearchGroups(
        updateSearchGroups(data.groupSearch, searchGroups, replaceItems),
      );
      setReplaceItems(false);
    },
  });

  if (!searchGroups.length || loading) {
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

  const suggestion =
    searchData.groupSearch[0]?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]
      ?.text;

  const allSubjects =
    data.subjects?.map(subject => ({
      title: subject.name,
      value: subject.id,
    })) || [];

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchContainer
          error={error}
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjects={searchParams.subjects}
          allSubjects={allSubjects}
          suggestion={suggestion}
          subjectItems={subjectItems}
          setParams={setParams}
          currentSubjectType={currentSubjectType}
          setCurrentSubjectType={setCurrentSubjectType}
          searchGroups={searchGroups}
          setSearchGroups={setSearchGroups}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          setReplaceItems={setReplaceItems}
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
