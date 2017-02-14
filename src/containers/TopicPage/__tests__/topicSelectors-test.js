/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTopicsBySubjectId, getTopic, getSubtopicsWithIntroduction } from '../topicSelectors';

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

test('topicSelectors getTopics', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };

  expect(getTopic('urn:subject:1', topics[0].id)(state)).toBe(topics[0]);
  expect(getTopic('urn:subject:1', topics[1].id)(state)).toBe(topics[1]);
  expect(getTopic('urn:subject:1', topics[0].subtopics[0].id)(state)).toBe(topics[0].subtopics[0]);
  expect(getTopic('urn:subject:1', 'sadfjl')(state)).toBe(undefined);
});

test('topicSelectors getTopics', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
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
    .toEqual({ id: 'urn:topic:169397', introduction: 'Tester', name: 'Mediedesign', subtopics: [] });
  expect(getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[1])
    .toEqual({ id: 'urn:topic:170363', introduction: undefined, name: 'Idéutvikling', subtopics: [] });
});
