/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resourceTypes } from "./mockResources";
import { sortResourceTypes } from "../getResourceGroups";

test("resources types sort order", () => {
  const types = sortResourceTypes(resourceTypes);

  expect(types.length).toBe(6);
  expect(types[0]?.id).toBe("urn:resourcetype:learningPath");
  expect(types[1]?.id).toBe("urn:resourcetype:subjectMaterial");
  expect(types[2]?.id).toBe("urn:resourcetype:tasksAndActivities");
  expect(types[3]?.id).toBe("urn:resourcetype:reviewResource");
  expect(types[4]?.id).toBe("urn:resourcetype:SourceMaterial");
  expect(types[5]?.id).toBe("urn:resourcetype:concept");

  expect(types).toMatchSnapshot();
});
