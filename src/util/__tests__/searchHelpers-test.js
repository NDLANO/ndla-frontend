/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { searchSubjects, mapSearchToFrontPageStructure } from '../searchHelpers';

const subjects = [
  {
    id: 'urn:subject:1',
    name: 'Fag (Vg2)',
    metadata: {
      customFields: {
        subjectCategory: 'active',
      },
    },
  },
];

test('search subjects', () => {
  // can fail if subjects.js is updated
  const searchResult = searchSubjects('(Vg2)', subjects);
  expect(searchResult?.length).toBe(1);
});

test('search subjects with one character', () => {
  const searchResult = searchSubjects('1', subjects);
  expect(searchResult?.length).toBe(0);
});

test('map function', () => {
  expect(mapSearchToFrontPageStructure({}, () => {}, undefined, [])).toEqual([]);
  const returnArray = mapSearchToFrontPageStructure(
    {
      frontpageSearch: {
        learningResources: { results: [], totalCount: 0 },
        topicResources: { results: ['tetr', 'geeg'], totalCount: 2 },
      },
    },
    () => {},
    'Vg2 og',
  );
  expect(returnArray.length).toBe(1);
});
