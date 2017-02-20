/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTopicsBySubjectId, getTopic, getSubtopicsWithIntroduction, getSubjectMenu } from '../topicSelectors';

import { topics, topicsFlattened } from './mockTopics';


test('topicSelectors getTopicsBySubjectId', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topicsFlattened,
        'urn:subject:2': [],
      },
    },
  };

  expect(getTopicsBySubjectId('urn:subject:1')(state)).toBe(topicsFlattened);
  expect(getTopicsBySubjectId('urn:subject:2')(state)).toEqual([]);
});

test('topicSelectors getTopic', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topicsFlattened,
      },
    },
  };

  expect(getTopic('urn:subject:1', topicsFlattened[0].id)(state)).toBe(topicsFlattened[0]);
  expect(getTopic('urn:subject:1', topicsFlattened[4].id)(state)).toBe(topicsFlattened[4]);
  expect(getTopic('urn:subject:1', 'sadfjl')(state)).toBe(undefined);
});

test('topicSelectors getSubtopicsWithIntroduction', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topicsFlattened,
      },
      topicIntroductions: {
        [topics[0].subtopics[0].id]: {
          introduction: [
            { introduction: 'Tester', language: 'nb' },
            { introduction: 'Testing', language: 'en' },
          ],
        },
      },
    },
  };

  expect(getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[0])
    .toEqual({ id: 'urn:topic:169397', introduction: 'Tester', name: 'Mediedesign', parentId: topics[0].id });
  expect(getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[1])
    .toEqual({ id: 'urn:topic:170363', introduction: undefined, name: 'Idéutvikling', parentId: topics[0].id });
});

test('topicSelectors getSubjectMenu', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topicsFlattened,
      },
    },
  };

  expect(getSubjectMenu('urn:subject:1')(state)).toEqual(
    [
      {
        id: 'urn:topic:172416',
        name: 'Idéutvikling og mediedesign',
        parentId: undefined,
        subtopics: [
          {
            id: 'urn:topic:169397',
            name: 'Mediedesign',
            parentId: 'urn:topic:172416',
            subtopics: [],
          },
          {
            id: 'urn:topic:170363',
            name: 'Idéutvikling',
            parentId: 'urn:topic:172416',
            subtopics: [
              {
                id: 'urn:topic:1703324',
                parentId: 'urn:topic:170363',
                name: 'Mediebransjen',
                subtopics: [],
              },
            ],
          },
        ],
      },
      {
        id: 'urn:topic:169412',
        name: 'Mediekommunikasjon',
        parentId: undefined,
        subtopics: [],
      },
    ],
  );
});
