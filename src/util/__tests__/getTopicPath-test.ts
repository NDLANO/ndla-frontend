/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTopicPath, TaxonomyContext } from "../getTopicPath";

describe("getTopicPath", () => {
  it("handles a regular resource path", () => {
    const path = "/subject:1/topic:1/resource:1";
    const taxonomContexts: TaxonomyContext[] = [
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/resource:1",
      },
      {
        parentIds: ["urn:subject:1", "urn:topic:2"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Mediedesign"],
        path: "/subject:1/topic:2/resource:1",
      },
    ];
    const res = getTopicPath(path, taxonomContexts);
    expect(res).toEqual([
      { name: "Idéutvikling og mediedesign", id: "urn:subject:1" },
      { name: "Idéutvikling", id: "urn:topic:1" },
    ]);
  });
  it("handles nested topics", () => {
    const path = "/subject:1/topic:1/topic:2/resource:1";
    const taxonomContexts: TaxonomyContext[] = [
      {
        parentIds: ["urn:subject:1", "urn:topic:1", "urn:topic:3"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling", "Mediebransjen"],
        path: "/subject:1/topic:1/topic:3/resource:1",
      },
      {
        parentIds: ["urn:subject:1", "urn:topic:1", "urn:topic:2"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling", "Lærerbransjen"],
        path: "/subject:1/topic:1/topic:2/resource:1",
      },
    ];
    const res = getTopicPath(path, taxonomContexts);
    expect(res).toEqual([
      { name: "Idéutvikling og mediedesign", id: "urn:subject:1" },
      { name: "Idéutvikling", id: "urn:topic:1" },
      { name: "Lærerbransjen", id: "urn:topic:2" },
    ]);
  });
  it("handles paths ending in a topic", () => {
    const path = "/subject:1/topic:1/topic:2/";
    const taxonomContexts: TaxonomyContext[] = [
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/topic:3/",
      },
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/topic:2/",
      },
    ];
    const res = getTopicPath(path, taxonomContexts);
    expect(res).toEqual([
      { name: "Idéutvikling og mediedesign", id: "urn:subject:1" },
      { name: "Idéutvikling", id: "urn:topic:1" },
    ]);
  });
  it("returns nothing if no match is found", () => {
    const path = "/subject:1/topic:1/topic:5/";
    const taxonomContexts: TaxonomyContext[] = [
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/topic:3/",
      },
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/topic:2/",
      },
    ];
    const res = getTopicPath(path, taxonomContexts);
    expect(res).toEqual([]);
  });

  it("handles learningpaths with a step", () => {
    const path = "/subject:1/topic:1/resource:1/77";
    const taxonomContexts: TaxonomyContext[] = [
      {
        parentIds: ["urn:subject:1", "urn:topic:1"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Idéutvikling"],
        path: "/subject:1/topic:1/resource:1",
      },
      {
        parentIds: ["urn:subject:1", "urn:topic:2"],
        breadcrumbs: ["Idéutvikling og mediedesign", "Mediedesign"],
        path: "/subject:1/topic:2/resource:1",
      },
    ];
    const res = getTopicPath(path, taxonomContexts);
    expect(res).toEqual([
      { name: "Idéutvikling og mediedesign", id: "urn:subject:1" },
      { name: "Idéutvikling", id: "urn:topic:1" },
    ]);
  });
});
