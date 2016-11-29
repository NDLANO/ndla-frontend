/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSubjects } from '../subjectSelectors';

const subjectObjects = [
  {
    id: 'urn:subject:4160',
    name: 'physics',
  },
  {
    id: 'urn:subject:40964264',
    name: 'Medieuttrykk og mediesamfunnet',
  },
];

test('subjectSelectors getSubjects', () => {
  const state = {
    subjects: {
      hasFetched: false,
      fetching: false,
      all: subjectObjects,
    },
  };

  expect(getSubjects(state)).toBe(subjectObjects);
});
