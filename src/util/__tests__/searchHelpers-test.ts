/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { searchSubjects } from "../searchHelpers";

const subjects = [
  {
    id: "urn:subject:1",
    name: "Fag (Vg2)",
    path: "",
    metadata: {
      customFields: {
        subjectCategory: "active",
      },
    },
  },
];

test("search subjects", () => {
  // can fail if subjects.js is updated
  const searchResult = searchSubjects("(Vg2)", subjects);
  expect(searchResult?.length).toBe(1);
});

test("search subjects with one character", () => {
  const searchResult = searchSubjects("1", subjects);
  expect(searchResult?.length).toBe(0);
});
