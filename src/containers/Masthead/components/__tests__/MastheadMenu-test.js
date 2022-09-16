/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { toTopicWithBoundParams } from '../MastheadMenu';

const expandedTopicIds = [
  'urn:topic:main',
  'urn:topic:sub',
  'urn:topic:subsub',
  'urn:topic:subsubsub',
];

test('Get path to main topicId', () => {
  const pathToMain = toTopicWithBoundParams(
    'urn:subject:1',
    ...expandedTopicIds,
  )('urn:topic:main');

  expect(pathToMain).toBe('/subject:1/topic:main/');
});

test('Get path to sub topicId', () => {
  const pathToSub = toTopicWithBoundParams(
    'urn:subject:1',
    ...expandedTopicIds,
  )('urn:topic:sub');

  expect(pathToSub).toBe('/subject:1/topic:main/topic:sub/');
});

test('Get path to leaf topicId', () => {
  const pathToLeaf = toTopicWithBoundParams(
    'urn:subject:1',
    ...expandedTopicIds,
  )('urn:topic:subsubsub');

  expect(pathToLeaf).toBe(
    '/subject:1/topic:main/topic:sub/topic:subsub/topic:subsubsub/',
  );
});
