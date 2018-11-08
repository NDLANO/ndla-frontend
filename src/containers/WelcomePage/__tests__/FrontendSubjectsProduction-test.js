/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCategoriesWithAllSubjects } from '../FrontpageSubjects';

jest.mock('../../../config', () => ({ isNdlaProdEnvironment: true }));

const samfunnsfag = {
  id: 'urn:subject:3',
  name: 'Samfunnsfag',
};

const historie = {
  id: 'urn:subject:9',
  name: 'Historie Vg2 og Vg3',
};

const matematikk = {
  id: 'urn:subject:10',
  name: 'Matematikk fellesfag',
};

const service = {
  id: 'urn:subject:12',
  name: 'Service og samferdsel Vg1',
};

const helse = {
  id: 'urn:subject:4',
  name: 'Vg 2 Helsearbeiderfag',
};

const kinesisk = {
  id: 'urn:subject:2',
  name: 'Kinesisk',
};

const engelsk = {
  id: 'urn:subject:27',
  name: 'Internasjonal engelsk',
};

const categoriesFromApi = [
  {
    name: 'fellesfag',
    subjects: [samfunnsfag, historie, matematikk],
  },
  {
    name: 'yrkesfag',
    subjects: [service, helse],
  },
  {
    name: 'studiespesialiserende',
    subjects: [kinesisk, engelsk],
  },
];

function hasSubjectId(categories, subjectId) {
  const found = categories.find(category =>
    category.subjects.find(subject => subject.id === subjectId),
  );
  return found !== undefined;
}

test('that getCategoriesWithAllSubjects only returns allowed subjects', () => {
  const categories = getCategoriesWithAllSubjects(categoriesFromApi, 'nb');

  expect(hasSubjectId(categories, historie.id)).toBe(true);
  expect(hasSubjectId(categories, samfunnsfag.id)).toBe(true);
  expect(hasSubjectId(categories, service.id)).toBe(true);
  expect(hasSubjectId(categories, kinesisk.id)).toBe(true);

  expect(hasSubjectId(categories, helse.id)).toBe(false);
  expect(hasSubjectId(categories, matematikk.id)).toBe(false);
  expect(hasSubjectId(categories, engelsk.id)).toBe(false);
});
