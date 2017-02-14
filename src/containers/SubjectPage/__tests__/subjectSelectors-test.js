/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSubjects, getSubjectById, getTopicsBySubjectId, getTopic, getSubtopicsWithIntroduction } from '../subjectSelectors';

import { subjects, topics } from './mockSubjects';

test('subjectSelectors getSubjects', () => {
  const state = {
    subjects: {
      hasFetched: false,
      fetching: false,
      all: subjects,
    },
  };

  expect(getSubjects(state)).toBe(subjects);
});

test('subjectSelectors getTopicsBySubjectId', () => {
  const state = {
    subjects: {
      hasFetched: false,
      fetching: false,
      topics: {
        [subjects[0].id]: topics,
        [subjects[1].id]: [],
      },
    },
  };

  expect(getTopicsBySubjectId(subjects[0].id)(state)).toBe(topics);
  expect(getTopicsBySubjectId(subjects[1].id)(state)).toEqual([]);
});

test('subjectSelectors getTopicsBySubjectId', () => {
  const state = {
    subjects: {
      hasFetched: false,
      fetching: false,
      all: subjects,
    },
  };

  expect(getSubjectById(subjects[0].id)(state)).toBe(subjects[0]);
  expect(getSubjectById(subjects[1].id)(state)).toBe(subjects[1]);
});

test('subjectSelectors getTopics', () => {
  const state = {
    subjects: {
      hasFetched: false,
      fetching: false,
      all: subjects,
      topics: {
        [subjects[0].id]: topics,
      },
    },
  };

  expect(getTopic(subjects[0].id, topics[0].id)(state)).toBe(topics[0]);
  expect(getTopic(subjects[0].id, topics[1].id)(state)).toBe(topics[1]);
  expect(getTopic(subjects[0].id, topics[0].subtopics[0].id)(state)).toBe(topics[0].subtopics[0]);
  expect(getTopic(subjects[0].id, 'sadfjl')(state)).toBe(undefined);
});

test('subjectSelectors getTopics', () => {
  const state = {
    locale: 'nb',
    subjects: {
      topics: {
        [subjects[0].id]: topics,
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

  expect(getSubtopicsWithIntroduction(subjects[0].id, topics[0].id)(state)[0])
    .toEqual({ id: 'urn:topic:169397', introduction: 'Tester', name: 'Mediedesign', subtopics: [] });
  expect(getSubtopicsWithIntroduction(subjects[0].id, topics[0].id)(state)[1])
    .toEqual({ id: 'urn:topic:170363', introduction: undefined, name: 'Idéutvikling', subtopics: [] });
});
