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


test('resourceSelectors getResourcesByTopicId default locale', () => {
  const state = {
    resources: {
      all: {
        'urn:topic:1': resourceData,
        'urn:topic:2': [],
      },
    },
  };
  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);
  expect(resources[0]).toEqual({
    contentUri: 'urn:learningpath:1',
    description: 'Desc: Teknikker for idéutvikling',
    introduction: undefined,
    title: 'Teknikker for idéutvikling',
  });
  expect(resources[2]).toEqual({
    contentUri: 'urn:article:2',
    description: undefined,
    introduction: 'Intro ideer og idéutvikling',
    title: 'Ideer og idéutvikling',
  });
});

test('resourceSelectors getResourcesByTopicId en locale', () => {
  const state = {
    locale: 'en',
    resources: {
      all: {
        'urn:topic:1': resourceData,
        'urn:topic:2': [],
      },
    },
  };

  const resources = getResourcesByTopicId('urn:topic:1')(state);

  expect(resources.length).toBe(3);

  expect(resources[0].title).toBe('Technique');
  expect(resources[0].description).toBe('Desc: Technique');

  expect(resources[2].title).toBe('Ideas');
  expect(resources[2].introduction).toBe('Intro ideas');
});
