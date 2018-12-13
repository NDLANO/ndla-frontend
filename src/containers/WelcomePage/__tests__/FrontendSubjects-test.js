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

function findSubjectByName(categories, name) {
  const allSubjects = categories.reduce(
    (acc, category) => [...acc, ...category.subjects],
    [],
  );
  return allSubjects.find(subject => subject.name === name);
}

test('mapHardCodedCategories without frontpageFilters from api (nb locale)', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'nb');

  expect(categories).toMatchSnapshot();
});

test('mapHardCodedCategories with nn locale', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'nn');

  const norsk = findSubjectByName(categories, 'Norsk Vg2 og Vg3 SF');

  expect(norsk.url).toBe('/nn/node/27');
});

test('mapHardCodedCategories with en locale', () => {
  const categories = mapHardCodedCategories(categoriesFromApi, 'en');

  const norsk = findSubjectByName(categories, 'Norsk Vg2 og Vg3 SF');

  expect(norsk.url).toBe('/nb/node/27');
});

test('mapHardCodedCategories with frontpageFilters from api', () => {
  const specializationCategory = {
    ...categoriesFromApi[2],
    subjects: specializationSubjects,
  };
  const categories = mapHardCodedCategories([specializationCategory], 'nb');

  const kinesisk1 = findSubjectByName(categories, 'Kinesisk 1');
  expect(kinesisk1.url).toBe('/subjects/subject:2?filters=urn:filter:1337');

  const kinesisk2 = findSubjectByName(categories, 'Kinesisk 2');
  expect(kinesisk2.url).toBe('/subjects/subject:2?filters=urn:filter:42');
});
