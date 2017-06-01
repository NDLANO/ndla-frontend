/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getAllTopicsBySubjectId,
  getTopic,
  getSubtopicsWithIntroduction,
  getSubjectMenu,
  getSubtopics,
  getTopicPath,
} from '../topicSelectors';

import { topics } from './mockTopics';

test('topicSelectors getAllTopicsBySubjectId', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
        'urn:subject:2': [],
      },
    },
  };

  expect(getAllTopicsBySubjectId('urn:subject:1')(state)).toBe(topics);
  expect(getAllTopicsBySubjectId('urn:subject:2')(state)).toEqual([]);
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
        'urn:topic:1_1': {
          introduction: [
            { introduction: 'Tester', language: 'nb' },
            { introduction: 'Testing', language: 'en' },
          ],
        },
      },
    },
  };

  expect(
    getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[0],
  ).toEqual({
    id: 'urn:topic:1_1',
    introduction: 'Tester',
    name: 'Mediedesign',
    parent: topics[0].id,
  });
  expect(
    getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[1],
  ).toEqual({
    contentUri: 'urn:article:1_2',
    id: 'urn:topic:1_2',
    introduction: undefined,
    name: 'Idéutvikling',
    parent: topics[0].id,
  });
});

test('topicSelectors getSubjectMenu', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };

  expect(getSubjectMenu('urn:subject:1')(state)).toEqual([
    {
      id: 'urn:topic:1',
      name: 'Idéutvikling og mediedesign',
      parent: 'urn:subject:1',
      contentUri: 'urn:article:1',
      subtopics: [
        {
          id: 'urn:topic:1_1',
          name: 'Mediedesign',
          parent: 'urn:topic:1',
          subtopics: [],
        },
        {
          id: 'urn:topic:1_2',
          name: 'Idéutvikling',
          parent: 'urn:topic:1',
          contentUri: 'urn:article:1_2',
          subtopics: [
            {
              id: 'urn:topic:1_2_1',
              parent: 'urn:topic:1_2',
              name: 'Mediebransjen',
              subtopics: [],
            },
          ],
        },
      ],
    },
    {
      id: 'urn:topic:2',
      name: 'Mediekommunikasjon',
      parent: undefined,
      subtopics: [],
    },
  ]);
});

test('topicSelectors getTopicPath', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };
  const topicPath1 = getTopicPath('urn:subject:1', 'urn:topic:1_2_1')(state);
  expect(topicPath1.length).toBe(3);
  expect(topicPath1[0].name).toBe('Idéutvikling og mediedesign');
  expect(topicPath1[1].name).toBe('Idéutvikling');
  expect(topicPath1[2].name).toBe('Mediebransjen');

  const topicPath2 = getTopicPath('urn:subject:1', 'urn:topic:3')(state);
  expect(topicPath2).toEqual([]);

  const topicPath3 = getTopicPath('urn:subject:1', 'urn:topic:1_1')(state);
  expect(topicPath3.length).toBe(2);
  expect(topicPath1[0].name).toBe('Idéutvikling og mediedesign');
  expect(topicPath1[1].name).toBe('Idéutvikling');
});
