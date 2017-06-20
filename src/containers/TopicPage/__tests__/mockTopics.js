/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const topics = [
  {
    id: 'urn:topic:1',
    name: 'Idéutvikling og mediedesign',
    contentUri: 'urn:article:1',
    parent: 'urn:subject:1',
  },
  {
    id: 'urn:topic:1_1',
    name: 'Mediedesign',
    parent: 'urn:topic:1',
  },
  {
    id: 'urn:topic:1_2',
    name: 'Idéutvikling',
    contentUri: 'urn:article:1_2',
    parent: 'urn:topic:1',
  },
  {
    id: 'urn:topic:1_2_1',
    name: 'Mediebransjen',
    parent: 'urn:topic:1_2',
  },
  {
    id: 'urn:topic:2',
    name: 'Mediekommunikasjon',
    parent: undefined,
  },
];

export const articles = [
  {
    id: 'urn:article:1',
    introduction: 'Introduction 1',
  },
  {
    id: 'urn:article:1_2',
    introduction: 'Introduction 2',
  },
];
