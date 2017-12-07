/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import defined from 'defined';
import createFetchActions from '../../util/createFetchActions';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from '../../constants';

export const setTopicResources = createAction('SET_TOPIC_RESOURCES');
export const fetchTopicResourcesActions = createFetchActions('TOPIC_RESOURCES');
export const setResourceTypes = createAction('SET_RESOURCE_TYPES');

export const actions = {
  ...fetchTopicResourcesActions,
  setTopicResources,
  setResourceTypes,
};

export const initalState = {
  all: {},
  fetchTopicResourcesFailed: false,
  types: [],
};

export default handleActions(
  {
    [actions.setTopicResources]: {
      next: (state, action) => {
        const { topicId, resources, additionalResources } = action.payload;
        const additional = additionalResources.map(r => ({
          ...r,
          additional: true,
        }));
        return {
          ...state,
          fetchTopicResourcesFailed: false,
          all: { ...state.all, [topicId]: [...additional, ...resources] },
        };
      },
      throw: state => state,
    },
    [actions.setResourceTypes]: {
      next: (state, action) => {
        const resourceTypes = action.payload;
        return {
          ...state,
          fetchTopicResourcesFailed: false,
          types: resourceTypes,
        };
      },
      throw: state => state,
    },
    [actions.fetchTopicResourcesError]: {
      next: state => ({
        ...state,
        fetchTopicResourcesFailed: true,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getResourcesFromState = state => state.resources;

export const getResources = createSelector(
  [getResourcesFromState],
  resources => resources.all,
);

const sortOrder = {
  [RESOURCE_TYPE_LEARNING_PATH]: 1,
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: 2,
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: 3,
};

export const getResourceTypes = createSelector(
  [getResourcesFromState],
  resources =>
    resources.types.sort((a, b) => {
      if (sortOrder[a.id] === undefined && sortOrder[b.id] === undefined)
        return 0;
      if (sortOrder[a.id] === undefined) return 1;

      return sortOrder[a.id] > sortOrder[b.id];
    }),
);

export const hasFetchTopicResourcesFailed = createSelector(
  [getResourcesFromState],
  resources => resources.fetchTopicResourcesFailed,
);

export const getResourcesByTopicId = topicId =>
  createSelector([getResources], all => defined(all[topicId], []));

export const getResourcesByTopicIdGroupedByResourceTypes = topicId =>
  createSelector([getResourcesByTopicId(topicId)], resourcesByTopic =>
    resourcesByTopic.reduce((obj, resource) => {
      const resourceTypesWithResources = resource.resourceTypes.map(type => {
        const existing = defined(obj[type.id], []);
        return { ...type, resources: [...existing, resource] };
      });
      const reduced = resourceTypesWithResources.reduce(
        (acc, type) => ({ ...acc, [type.id]: type.resources }),
        {},
      );
      return { ...obj, ...reduced };
    }, {}),
  );

export const getResourceTypesByTopicId = topicId =>
  createSelector(
    [getResourceTypes, getResourcesByTopicIdGroupedByResourceTypes(topicId)],
    (types, resourcesByResourceTypeId) =>
      types
        .map(type => {
          const resources = defined(resourcesByResourceTypeId[type.id], []);
          return { ...type, resources };
        })
        .filter(type => type.resources.length > 0),
  );
