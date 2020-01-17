/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  searchSubjects,
  mapSearchToFrontPageStructure,
} from '../searchHelpers';

test('search subjects', () => {
  const searchResult = searchSubjects('Vg2 og', 'nb', []);
  expect(searchResult.length).toBe(2);
});

test('map function', () => {
  expect(mapSearchToFrontPageStructure({}, () => {}, undefined, [])).toEqual(
    [],
  );
  const returnArray = mapSearchToFrontPageStructure(
    {
      frontpageSearch: {
        learningResources: { results: [], totalCount: 0 },
        topicResources: { results: ['tetr', 'geeg'], totalCount: 2 },
      },
    },
    () => {},
    'Vg2 og',
    'nb',
    [],
  );
  expect(returnArray.length).toBe(2);
});
