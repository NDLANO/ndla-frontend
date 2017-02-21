/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getTopicsBySubjectId,
  getTopic,
  getSubtopicsWithIntroduction,
  getSubjectMenu,
  getSubtopics,
} from '../topicSelectors';

import { topics } from './mockTopics';


test('topicSelectors getTopicsBySubjectId', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
        'urn:subject:2': [],
      },
    },
  };

  expect(getTopicsBySubjectId('urn:subject:1')(state)).toBe(topics);
  expect(getTopicsBySubjectId('urn:subject:2')(state)).toEqual([]);
});

test('topicSelectors getTopic', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };

  expect(getTopic('urn:subject:1', topics[0].id)(state)).toBe(topics[0]);
  expect(getTopic('urn:subject:1', topics[4].id)(state)).toBe(topics[4]);
  expect(getTopic('urn:subject:1', 'sadfjl')(state)).toBe(undefined);
});

test('topicSelectors getSubtopics', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };
  const subtopics = getSubtopics('urn:subject:1', topics[0].id)(state);

  expect(subtopics.length).toBe(2);
  expect(subtopics[0]).toBe(topics[1]);
  expect(subtopics[1]).toBe(topics[2]);
});

test('topicSelectors getSubtopicsWithIntroduction', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
      topicIntroductions: {
        'urn:topic:169397': {
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
        'urn:subject:1': topics,
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
