/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getResourcesByTopicId,
  getResourceTypes,
  getResourcesByTopicIdGroupedByResourceTypes,
  getResourceTypesByTopicId,
} from '../resourceSelectors';

import { resourceData, resourceTypes } from './mockResources';

const resourcesState = {
  resources: {
    all: {
      'urn:topic:1': resourceData,
      'urn:topic:2': [],
    },
    types: resourceTypes,
  },
};

test('resourceSelectors getResourceTypes', () => {
  const state = resourcesState;
  const types = getResourceTypes(state);

  expect(types.length).toBe(6);
  expect(types).toEqual(types);
});

test('resourceSelectors getResourcesByTopicId default locale', () => {
  const state = resourcesState;
  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);
  expect(resources[0].title).toBe('Teknikker for idéutvikling');
  expect(resources[0].introduction).toBe('Desc: Teknikker for idéutvikling');
  expect(resources[2].title).toBe('Ideer og idéutvikling');
  expect(resources[2].introduction).toBe('Intro ideer og idéutvikling');

  expect(getResourcesByTopicId('urn:topic:2')(state)).toEqual([]);
});


test('resourceSelectors getResourcesByTopicId en locale', () => {
  const state = {
    locale: 'en',
    ...resourcesState,
  };

  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);

  expect(resources[0].title).toBe('Technique');
  expect(resources[0].introduction).toBe('Desc: Technique');

  expect(resources[2].title).toBe('Ideas');
  expect(resources[2].introduction).toBe('Intro ideas');
});

test('resourceSelectors getResourcesByTopicIdGroupedByResourceTypes', () => {
  const state = resourcesState;
  const resourcesByResourceType = getResourcesByTopicIdGroupedByResourceTypes('urn:topic:1')(state);

  expect(resourcesByResourceType['urn:resource-type:1'].length).toBe(2);
  expect(resourcesByResourceType['urn:resource-type:2'].length).toBe(1);
  expect(resourcesByResourceType['urn:resource-type:3'].length).toBe(1);
});

test('resourceSelectors getResourceTypesByTopicId', () => {
  const state = resourcesState;
  const topicResourcesByType = getResourceTypesByTopicId('urn:topic:1')(state);

  expect(topicResourcesByType[0].resources.length).toBe(3);
  expect(topicResourcesByType[0].name).toBe('Fagstoff');
  expect(topicResourcesByType[1].resources.length).toBe(1);
  expect(topicResourcesByType[1].name).toBe('Læringssti');
});
