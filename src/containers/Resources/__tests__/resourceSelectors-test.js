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
  getAllResourcesAsArray,
  getResource,
} from '../resource';

import { resourceData1, resourceData2, resourceTypes } from './mockResources';

const resourcesState = {
  resources: {
    all: {
      'urn:topic:1': resourceData1,
      'urn:topic:2': [],
      'urn:topic:3': resourceData2,
    },
    types: resourceTypes,
  },
};

test('resourceSelectors getResourceTypes', () => {
  const state = resourcesState;
  const types = getResourceTypes(state);

  expect(types.length).toBe(7);
  expect(types[0].id).toBe('urn:resourcetype:learningPath'); // expect learningPath to be first
  expect(types).toMatchSnapshot();
});

test('resourceSelectors getResourcesByTopicId', () => {
  const state = resourcesState;
  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);
  expect(resources[0].name).toBe('Teknikker for idéutvikling');
  expect(resources[2].name).toBe('Ideer og idéutvikling');

  expect(getResourcesByTopicId('urn:topic:2')(state)).toEqual([]);
});

test('resourceSelectors getResourcesByTopicIdGroupedByResourceTypes', () => {
  const state = resourcesState;
  const resourcesByResourceType = getResourcesByTopicIdGroupedByResourceTypes(
    'urn:topic:1',
  )(state);

  expect(
    resourcesByResourceType['urn:resourcetype:subjectMaterial'].length,
  ).toBe(3);
  expect(resourcesByResourceType['urn:resourcetype:learningPath'].length).toBe(
    1,
  );
  expect(
    resourcesByResourceType['urn:resourcetype:academicArticle'].length,
  ).toBe(1);
});

test('resourceSelectors getResourceTypesByTopicId', () => {
  const state = resourcesState;
  const topicResourcesByType = getResourceTypesByTopicId('urn:topic:1')(state);

  expect(topicResourcesByType[0].resources.length).toBe(1);
  expect(topicResourcesByType[0].name).toBe('Læringssti');
  expect(topicResourcesByType[1].resources.length).toBe(3);
  expect(topicResourcesByType[1].name).toBe('Fagstoff');
});

test('get all resources as array', () => {
  const all = getAllResourcesAsArray(resourcesState);
  expect(Array.isArray(all)).toBe(true);
  expect(all.length).toBe(6);
});

test('get resource by id', () => {
  const resource1 = getResource('urn:resource:1')(resourcesState);
  expect(resource1.id).toBe('urn:resource:1');

  const resource2 = getResource('urn:resource:4')(resourcesState);
  expect(resource2.id).toBe('urn:resource:4');
});
