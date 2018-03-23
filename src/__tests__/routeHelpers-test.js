/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toBreadcrumbList } from '../routeHelpers';

const subject = {
  name: 'Historie vg2 og vg3',
  path: '/subject:9',
};

const topicPath = [
  {
    name: 'Om Utforskeren ',
    path: '/subject:9/topic:1:179373',
  },
  {
    name: 'Samfunnsfaglige tenkemåter',
    path: '/subject:3/topic:1:179373/topic:1:170165',
  },
];

const resource = {
  name: 'Utforskeren',
  path: '/subject:9/topic:1:179373/topic:1:170165/resource:1:168389',
};

test('should make breadcrumb list from subject ', () => {
  expect(toBreadcrumbList(subject)).toMatchSnapshot();
});

test('should make breadcrumb list from subject, topicpath ', () => {
  expect(toBreadcrumbList(subject, topicPath)).toMatchSnapshot();
});

test('should make breadcrumb list from subject, topicpath and resouce', () => {
  expect(toBreadcrumbList(subject, topicPath, resource)).toMatchSnapshot();
});
