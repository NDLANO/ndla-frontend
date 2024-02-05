/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toBreadcrumbItems } from "../routeHelpers";

const subject = {
  id: "urn:subject:9",
  name: "Historie vg2 og vg3",
  path: "/subject:9",
};
const topics = [
  {
    id: "urn:topic:1:179373",
    name: "Om Utforskeren ",
    path: "/subject:9/topic:1:179373",
  },
  {
    id: "urn:topic:1:170165",
    name: "Samfunnsfaglige tenkemåter",
    path: "/subject:3/topic:1:179373/topic:1:170165",
  },
];

const resource = {
  id: "urn:resource:1:168389",
  name: "Utforskeren",
  path: "/subject:9/topic:1:179373/topic:1:170165/resource:1:168389",
};

test("breadcrumb items from subject ", () => {
  expect(toBreadcrumbItems("Home", [subject])).toMatchSnapshot();
});

test("breadcrumb items from from subject and topicpath", () => {
  expect(toBreadcrumbItems("Home", [subject, ...topics])).toMatchSnapshot();
});

test("breadcrumb items from from subject, topicpath and resouce", () => {
  expect(toBreadcrumbItems("Home", [subject, ...topics, resource])).toMatchSnapshot();
});
