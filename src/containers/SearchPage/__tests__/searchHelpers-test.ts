/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { searchResultToLinkProps, convertSearchStringToObject, convertSearchParam } from "../searchHelpers";

test("searchHelpers searchResultToLinkProps learningpath", () => {
  const result = {
    id: 500,
    resourceType: "urn:resourcetype:learningPath",
    url: "/r/learningpath/asdfghjk",
  };

  expect(searchResultToLinkProps(result)).toMatchSnapshot();
});

test("searchHelpers searchResultToLinkProps article", () => {
  const result = {
    id: 300,
    resourceType: "urn:resourcetype:subjectMaterial",
    url: "/article/300",
  };

  expect(searchResultToLinkProps(result)).toMatchSnapshot();
});

test("searchHelpers convertSearchStringToObject converts search string", () => {
  const locationWithSearch = {
    search: "?query=test&page=3&languageFilter=1,2,3&subjects=urn:test:3,urn:test:1,urn:test:2",
  };

  expect(convertSearchStringToObject(locationWithSearch)).toMatchSnapshot();
});

test("searchHelpers convertSearchStringToObject with no location", () => {
  expect(convertSearchStringToObject()).toMatchSnapshot();
});

test("searchHelpers convertSearchParam", () => {
  expect(convertSearchParam()).toEqual(undefined);
  expect(convertSearchParam("NDLA")).toBe("NDLA");
  expect(convertSearchParam(27)).toBe(27);
  expect(convertSearchParam([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe("1,2,3,4,5,6,7,8,9,10");
});
