/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSubjects, getSubjectById } from '../subjects';

import { subjects } from './mockSubjects';

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

test('subjectSelectors getSubjectById', () => {
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
