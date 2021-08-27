/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { groupedSubtopicsByParent } from '../topicsHelper';

const topics = [
  {
    id: 'urn:topic:1',
  },
  {
    id: 'urn:topic:2',
    parent: 'urn:subject:1',
  },
  {
    id: 'urn:topic:3',
    parent: 'urn:subject:1',
  },
  {
    id: 'urn:topic:4',
    parent: 'urn:topic:3',
  },
];

const groupedTopics = {
  'urn:subject:1': [
    {
      id: 'urn:topic:2',
      parent: 'urn:subject:1',
    },
    {
      id: 'urn:topic:3',
      parent: 'urn:subject:1',
    },
  ],
  'urn:topic:3': [
    {
      id: 'urn:topic:4',
      parent: 'urn:topic:3',
    },
  ],
};

test('groupedSubtopicsByParent', () => {
  expect(groupedSubtopicsByParent(topics)).toStrictEqual(groupedTopics);
});
