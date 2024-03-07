/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTopicPath } from "../getTopicPath";

const topics = [
  {
    id: "urn:topic:1",
    name: "Idéutvikling og mediedesign",
    contentUri: "urn:article:1",
    parentId: "urn:subject:1",
  },
  {
    id: "urn:topic:1_1",
    name: "Mediedesign",
    parentId: "urn:topic:1",
  },
  {
    id: "urn:topic:1_2",
    name: "Idéutvikling",
    contentUri: "urn:article:1_2",
    parentId: "urn:topic:1",
  },
  {
    id: "urn:topic:1_2_1",
    name: "Mediebransjen",
    parentId: "urn:topic:1_2",
  },
  {
    id: "urn:topic:2",
    name: "Mediekommunikasjon",
    parentId: undefined,
  },
];

test("getTopicPath", () => {
  const topicPath1 = getTopicPath("urn:subject:1", "urn:topic:1_2_1", topics);
  expect(topicPath1.length).toBe(3);
  expect(topicPath1[0]?.name).toBe("Idéutvikling og mediedesign");
  expect(topicPath1[1]?.name).toBe("Idéutvikling");
  expect(topicPath1[2]?.name).toBe("Mediebransjen");

  const topicPath2 = getTopicPath("urn:subject:1", "urn:topic:3", topics);
  expect(topicPath2).toEqual([]);

  const topicPath3 = getTopicPath("urn:subject:1", "urn:topic:1_1", topics);
  expect(topicPath3.length).toBe(2);
  expect(topicPath1[0]?.name).toBe("Idéutvikling og mediedesign");
  expect(topicPath1[1]?.name).toBe("Idéutvikling");
});
