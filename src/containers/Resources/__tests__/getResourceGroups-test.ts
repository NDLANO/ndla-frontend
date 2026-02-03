/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortResources } from "../getResourceGroups";
import { resources, resourceTypes } from "./mockResources";

test("resources are sorted according to resource types order", () => {
  const types = sortResources(resources, resourceTypes, true);

  expect(types.length).toBe(6);
  expect(types[0]?.id).toBe("urn:resource:3");
  expect(types[1]?.id).toBe("urn:resource:5");
  expect(types[2]?.id).toBe("urn:resource:2");
  expect(types[3]?.id).toBe("urn:resource:1");
  expect(types[4]?.id).toBe("urn:resource:4");
  expect(types[5]?.id).toBe("urn:resource:6");

  expect(types).toMatchSnapshot();
});
