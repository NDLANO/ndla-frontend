/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSubjects, getTopicsBySubjectId } from '../subjectSelectors';

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

  const getTopicsSelector1 = getTopicsBySubjectId(subjects[0].id);
  expect(getTopicsSelector1(state)).toBe(topics);

  const getTopicsSelector2 = getTopicsBySubjectId(subjects[1].id);
  expect(getTopicsSelector2(state)).toEqual([]);
});
