/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resourceData1, resourceData2, resourceTypes } from "./mockResources";
import { GQLResource } from "../../../graphqlTypes";
import { getResourceGroupings, getResourceGroups, sortResourceTypes } from "../getResourceGroups";

type ResourceData = Pick<GQLResource, "id" | "resourceTypes" | "name" | "contentUri">;

test("get core resources grouped by types", () => {
  const groups = getResourceGroups(resourceTypes, [...resourceData1]);

  expect(groups).toMatchSnapshot();
});

test("get core and supplementary resources grouped by types", () => {
  const { sortedResources } = getResourceGroupings([...resourceData2, ...resourceData1]);
  const groups = getResourceGroups(resourceTypes, sortedResources);

  expect(groups).toMatchSnapshot();
});

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

test("filter out duplicates", () => {
  const dupe = resourceData2[0]!;
  const { sortedResources } = getResourceGroupings([...resourceData2, ...resourceData1, dupe]);
  const groups = getResourceGroups(resourceTypes, sortedResources);
  const type = groups.find((group) => group.id === "urn:resourcetype:subjectMaterial");
  const reduced = type?.resources?.reduce<ResourceData[]>((acc, resource) => {
    if (resource.id === dupe.id) {
      return acc.concat(dupe);
    }
    return acc;
  }, []);
  expect(reduced?.length).toBe(1);
});
