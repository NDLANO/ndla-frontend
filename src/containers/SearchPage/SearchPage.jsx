/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useState, useEffect, useReducer } from 'react';
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
  mapResourcesToItems,
  getTypeParams,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { contentTypeMapping } from '../../util/getContentType';
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

const PAGESIZE_SINGLE = 8;
const PAGESIZE_ALL = 4;

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const resourcesReducer = (state, action) => {
  console.log(action)
  switch (action.type) {
    case 'RESOURCE_TYPE_INITIALIZE':
     return action.data.map(result => {
      const filters = action.resourceTypes.find(type => type.id === result.resourceType)?.subtypes;
      return {
        items: mapResourcesToItems(result.resources),
        totalCount: result.totalCount,
        type: contentTypeMapping[result.resourceType] || result.resourceType,
        page: 1,
        pageSize: 4,
        loading: false,
        filters: filters ? [{ id: 'all', name: 'Alle', active: true }, ...filters] : [],
        }
     })
    case 'RESOURCE_TYPE_LOADING':
      return state.map(contextItem => {
        if (contextItem.type === action.contextType) {
          return {
            ...contextItem,
            loading: true,
          };
        } else {
          return contextItem;
        }
      });
    case 'RESOURCE_TYPE_ADD_ITEMS':
      return state.map(contextItem => {
        if (contextItem.type === action.contextType) {
          return {
            ...contextItem,
            items: [...contextItem.items, ...mapResourcesToItems(action.data[0].resources)],
            loading: false,
          };
        } else {
          return contextItem;
        }
      });
    case 'RESOURCE_TYPE_UPDATE':
      return state.map(contextItem => {
        if (contextItem.type === action.contextType) {
          return {
            ...contextItem,
            items: mapResourcesToItems(action.items),
            filters: action.filters,
            loading: false,
          };
        } else {
          return contextItem;
        }
      });
    case 'RESOURCE_TYPE_SELECTED':
      return state.map(contextItem => {
        if (contextItem.type === action.contextType) {
          return {
            ...contextItem,
            items: mapResourcesToItems(action.items),
            pageSize: PAGESIZE_SINGLE,
            active: true,
          };
        } else {
          return { ...contextItem, active: false };
        }
      });
    case 'RESOURCE_TYPE_ALL_SELECTED':
      return state.map(contextItem => {
        return { ...contextItem, pageSize: PAGESIZE_ALL, active: true };
      });
    default:
      return state;
  }
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
  const [searchGroups, searchGroupDispatch] = useReducer(resourcesReducer, []);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 4,
    type: null,
    preAction: '',
    postAction: 'RESOURCE_TYPE_INITIALIZE',
  });

  useEffect(() => {
    searchGroupDispatch({ type: params.preAction, contextType: params.type })
  }, [params]);
  const { data: searchData, error } = useGraphQuery(groupSearchQuery, {
    skip: loading,
    variables: {
      ...stateSearchParams,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...getTypeParams(params.type, resourceTypes, contextTypes),
    },
    onCompleted: searchData => {
      searchGroupDispatch({ type: params.postAction, contextType: params.type, data: searchData.groupSearch, resourceTypes: data.resourceTypes })
    }
      
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
