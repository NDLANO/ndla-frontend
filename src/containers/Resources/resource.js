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

export const setTopicResources = createAction('SET_TOPIC_RESOURCES');
export const fetchTopicResources = createAction('FETCH_TOPIC_RESOURCES');
export const setResourceTypes = createAction('SET_RESOURCE_TYPES');

export const actions = {
  setTopicResources,
  fetchTopicResources,
  setResourceTypes,
};

export const initalState = {
  all: {},
  types: [],
};

export default handleActions(
  {
    [actions.setTopicResources]: {
      next: (state, action) => {
        const { topicId, resources } = action.payload;
        return {
          ...state,
          all: { ...state.all, [topicId]: resources },
        };
      },
      throw: state => state,
    },
    [actions.setResourceTypes]: {
      next: (state, action) => {
        const resourceTypes = action.payload;
        return {
          ...state,
          types: resourceTypes,
        };
      },
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

export const getResourceTypes = createSelector(
  [getResourcesFromState],
  resources => resources.types,
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
          let subtypeResources = [];
          if (type.subtypes) {
            subtypeResources = type.subtypes.reduce(
              (acc, subtype) =>
                acc.concat(defined(resourcesByResourceTypeId[subtype.id], [])),
              [],
            );
          }
          const resources = defined(
            resourcesByResourceTypeId[type.id],
            [],
          ).concat(subtypeResources);
          return { ...type, resources };
        })
        .filter(type => type.resources.length > 0),
  );
