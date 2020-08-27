/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toBreadcrumbItems, isSubjectPagePath } from '../routeHelpers';

const subject = {
  id: 'urn:subject:9',
  name: 'Historie vg2 og vg3',
  path: '/subject:9',
};
const topics = [
  {
    id: 'urn:topic:1:179373',
    name: 'Om Utforskeren ',
    path: '/subject:9/topic:1:179373',
  },
  {
    id: 'urn:topic:1:170165',
    name: 'Samfunnsfaglige tenkemåter',
    path: '/subject:3/topic:1:179373/topic:1:170165',
  },
];

const resource = {
  id: 'urn:resource:1:168389',
  name: 'Utforskeren',
  path: '/subject:9/topic:1:179373/topic:1:170165/resource:1:168389',
};

test('breadcrumb items from subject ', () => {
  expect(toBreadcrumbItems('Home', [subject])).toMatchSnapshot();
});

test('breadcrumb items from from subject and topicpath', () => {
  expect(toBreadcrumbItems('Home', [subject, ...topics])).toMatchSnapshot();
});

test('breadcrumb items from from subject, topicpath and resouce', () => {
  expect(
    toBreadcrumbItems('Home', [subject, ...topics, resource]),
  ).toMatchSnapshot();
});

test('is pathname a subject page path', () => {
  expect(isSubjectPagePath('/subjects/subject:1')).toBe(true);
  expect(isSubjectPagePath('/subjects/subject:134')).toBe(true);
  expect(isSubjectPagePath('/subjects/subject:1/')).toBe(true);
  expect(isSubjectPagePath('/subjects/subject:1/topic:1:186460')).toBe(true);
  expect(
    isSubjectPagePath('/subjects/subject:1/topic:1:184105/topic:1:184106'),
  ).toBe(true);
  expect(
    isSubjectPagePath(
      '/subjects/subject:1/topic:1:184105/topic:1:184106/topic:1:184107/resource:1:62382',
    ),
  ).toBe(true); // not exactly right, but must do for now.
});
