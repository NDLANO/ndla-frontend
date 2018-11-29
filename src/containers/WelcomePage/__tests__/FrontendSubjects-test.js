/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mapHardCodedCategories } from '../FrontpageSubjects';

const categoriesFromApi = [
  {
    name: 'fellesfag',
    subjects: [],
  },
  {
    name: 'yrkesfag',
    subjects: [],
  },
  {
    name: 'studiespesialiserende',
    subjects: [],
  },
];

const specializationSubjects = [
  {
    id: 'urn:subject:7',
    name: 'Markedsføring og ledelse 1',
    path: '/subject:7',
    frontpageFilters: [],
  },
  {
    id: 'urn:subject:2',
    name: 'Kinesisk',
    frontpageFilters: [
      { name: 'Kinesisk 1', id: 'urn:filter:1337' },
      { name: 'Kinesisk 2', id: 'urn:filter:42' },
    ],
    path: '/subject:2',
  },
  {
    id: 'urn:subject:1',
    name: 'Medieuttrykk og mediesamfunnet',
    path: '/subject:1',
    frontpageFilters: [],
  },
];

const vocationalSubjects = [
  {
    id: 'urn:subject:12',
    name: 'Service og samferdsel Vg1',
    path: '/subject:12',
    frontpageFilters: [],
  },
];

test('mapHardCodedCategories all old node subjects (nb locale)', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'nb');

  expect(categories).toMatchSnapshot();
});

test('mapHardCodedCategories with all old node subjects (nn locale)', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'nn');

  expect(categories).toMatchSnapshot();
});

test('mapHardCodedCategories with all old node subjects (en locale)', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'en');

  expect(categories).toMatchSnapshot();
});

test('mapHardCodedCategories with some specialization subjects replaced', () => {
  const specializationCategory = {
    ...categoriesFromApi[2],
    subjects: specializationSubjects,
  };
  const categories = mapHardCodedCategories([specializationCategory], 'nb');

  expect(categories).toMatchSnapshot();
});

test('mapHardCodedCategories with a vocational subjects replaced', () => {
  const vocationalCategory = {
    ...categoriesFromApi[1],
    subjects: vocationalSubjects,
  };
  const categories = mapHardCodedCategories([vocationalCategory], 'nb');

  expect(categories).toMatchSnapshot();
});
