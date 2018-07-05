/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCategoriesWithAllSubjects } from '../FrontpageSubjects';

const catgoriesFromApi = [
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
  },
  {
    id: 'urn:subject:2',
    name: 'Kinesisk',
    path: '/subject:2',
  },
  {
    id: 'urn:subject:1',
    name: 'Medieuttrykk og mediesamfunnet',
    path: '/subject:1',
  },
];

const vocationalSubjects = [
  {
    id: 'urn:subject:12',
    name: 'Service og samferdsel Vg1',
    path: '/subject:12',
  },
];

test('getCategoriesWithAllSubjects with all old node subjects (nb locale)', () => {
  const categories = getCategoriesWithAllSubjects(catgoriesFromApi, 'nb');

  expect(categories).toMatchSnapshot();
});

test('getCategoriesWithAllSubjects with all old node subjects (nn locale)', () => {
  const categories = getCategoriesWithAllSubjects(catgoriesFromApi, 'nn');

  expect(categories).toMatchSnapshot();
});

test('getCategoriesWithAllSubjects with all old node subjects (en locale)', () => {
  const categories = getCategoriesWithAllSubjects(catgoriesFromApi, 'en');

  expect(categories).toMatchSnapshot();
});

test('getCategoriesWithAllSubjects with some specialization subjects replaced', () => {
  const specializationCategory = {
    ...catgoriesFromApi[2],
    subjects: specializationSubjects,
  };
  const categories = getCategoriesWithAllSubjects(
    [specializationCategory],
    'nb',
  );

  expect(categories).toMatchSnapshot();
});

test('getCategoriesWithAllSubjects with a vocational subjects replaced', () => {
  const vocationalCategory = {
    ...catgoriesFromApi[1],
    subjects: vocationalSubjects,
  };
  const categories = getCategoriesWithAllSubjects([vocationalCategory], 'nb');

  expect(categories).toMatchSnapshot();
});
