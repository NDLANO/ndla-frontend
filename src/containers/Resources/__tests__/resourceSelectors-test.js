/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getResourcesByTopicId,
} from '../resourceSelectors';

import { resourceData } from './mockResources';

const resourcesState = {
  resources: {
    all: {
      'urn:topic:1': resourceData,
      'urn:topic:2': [],
    },
  },
};

test('resourceSelectors getResourcesByTopicId default locale', () => {
  const state = resourcesState;
  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);
  expect(resources[0]).toEqual({
    contentUri: 'urn:learningpath:1',
    introduction: 'Desc: Teknikker for idéutvikling',
    title: 'Teknikker for idéutvikling',
  });
  expect(resources[2]).toEqual({
    contentUri: 'urn:article:2',
    introduction: 'Intro ideer og idéutvikling',
    title: 'Ideer og idéutvikling',
  });

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

