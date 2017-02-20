/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const topics =
  [
    {
      id: 'urn:topic:172416',
      name: 'Idéutvikling og mediedesign',
      subtopics: [
        {
          id: 'urn:topic:169397',
          name: 'Mediedesign',
          subtopics: [],
        },
        {
          id: 'urn:topic:170363',
          name: 'Idéutvikling',
          subtopics: [
            {
              id: 'urn:topic:1703324',
              name: 'Mediebransjen',
            },
          ],
        },
      ],
    },
    {
      id: 'urn:topic:169412',
      name: 'Mediekommunikasjon',
      subtopics: [],
    },
  ];

export const topicsFlattened = [
  {
    id: 'urn:topic:172416',
    name: 'Idéutvikling og mediedesign',
    parentId: undefined,
  },
  {
    id: 'urn:topic:169397',
    name: 'Mediedesign',
    parentId: 'urn:topic:172416',
  },
  {
    id: 'urn:topic:170363',
    name: 'Idéutvikling',
    parentId: 'urn:topic:172416',
  },
  {
    id: 'urn:topic:1703324',
    name: 'Mediebransjen',
    parentId: 'urn:topic:170363',
  },
  {
    id: 'urn:topic:169412',
    name: 'Mediekommunikasjon',
    parentId: undefined,
  },
];
