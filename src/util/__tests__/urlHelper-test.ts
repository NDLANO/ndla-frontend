/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseOembedUrl, isCurrentPage } from "../urlHelper";

describe("parseAndMatchUrl", () => {
  it("should parse a valid article url with old URL scheme", () => {
    const validArticleUrl1 = "https://www.ndla.no/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
    expect(parseOembedUrl(validArticleUrl1)).toEqual({
      resourceId: ":1:1682",
      subjectId: ":3",
      topic1: ":1:55163",
      topicId: ":1:168398",
    });
  });
  it("should parse a valid environment article url with old URL scheme", () => {
    const validArticleUrl1 = "https://www.test.ndla.no/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
    expect(parseOembedUrl(validArticleUrl1)).toEqual({
      resourceId: ":1:1682",
      subjectId: ":3",
      topic1: ":1:55163",
      topicId: ":1:168398",
    });
  });
  it("supports omitting www with old URL scheme", () => {
    const result = "https://ndla.no/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
    expect(parseOembedUrl(result)).toEqual({
      resourceId: ":1:1682",
      subjectId: ":3",
      topic1: ":1:55163",
      topicId: ":1:168398",
    });
  });
  it("supports localhost with old URL scheme", () => {
    const result = "https://localhost:3000/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
    expect(parseOembedUrl(result)).toEqual({
      resourceId: ":1:1682",
      subjectId: ":3",
      topic1: ":1:55163",
      topicId: ":1:168398",
    });
  });
  it("supports topic articles with old URL scheme", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/subject:3/topic:1:55163");
    expect(result).toEqual({
      subjectId: ":3",
      topicId: ":1:55163",
    });
  });
  it("supports language prefix with old URL scheme", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/nn/subject:3/topic:1:55163");
    expect(result).toEqual({
      subjectId: ":3",
      topicId: ":1:55163",
      lang: "nn",
    });
  });
  it("defaults to nb language prefix when encountering unknown languages with old URL scheme", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/unknown/subject:3/topic:1:55163");
    expect(result).toEqual({
      subjectId: ":3",
      topicId: ":1:55163",
      lang: "nb",
    });
  });
  it("supports nesting of topics with old URL scheme", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/subject:3/topic:1:55163/topic:1:168398/topic:1:168554");
    expect(result).toEqual({
      subjectId: ":3",
      topic1: ":1:55163",
      topic2: ":1:168398",
      topicId: ":1:168554",
    });
  });
  it("does not support subjects with old URL scheme", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/subject:3");
    expect(result).toEqual(undefined);
  });
  it("supports simple article path", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/article/4809");
    expect(result).toEqual({
      articleId: "4809",
    });
  });
  it("supports language prefix with simple article path", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/nn/article/4809");
    expect(result).toEqual({
      articleId: "4809",
      lang: "nn",
    });
  });
  it("does not support learningpath steps with old URL scheme", () => {
    const result = parseOembedUrl(
      "https://www.test.ndla.no/subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:3cdf9349-4593-498c-a899-9310133a4788/topic:2a5d3976-9969-41eb-b686-77a91a92e6be/topic:62ee79ca-eada-4103-9619-dc8fa6afd9c1/resource:de768880-92a1-45e8-972a-d0c2176730be/3",
    );
    expect(result).toEqual(undefined);
  });
  it("supports embed-iframe paths", () => {
    const videoResult = parseOembedUrl("https://www.test.ndla.no/embed-iframe/video/4809");
    expect(videoResult).toEqual({
      videoId: "4809",
    });
    const audioResult = parseOembedUrl("https://www.test.ndla.no/embed-iframe/audio/4809");
    expect(audioResult).toEqual({
      audioId: "4809",
    });
    const imageResult = parseOembedUrl("https://www.test.ndla.no/embed-iframe/image/4809");
    expect(imageResult).toEqual({
      imageId: "4809",
    });
    const conceptResult = parseOembedUrl("https://www.test.ndla.no/embed-iframe/concept/4809");
    expect(conceptResult).toEqual({
      conceptId: "4809",
    });
    const h5pResult = parseOembedUrl("https://www.test.ndla.no/embed-iframe/h5p/4809");
    expect(h5pResult).toEqual({
      h5pId: "4809",
    });
  });
  it("supports language prefix with embed-iframe paths", () => {
    const videoResult = parseOembedUrl("https://www.test.ndla.no/nn/embed-iframe/video/4809");
    expect(videoResult).toEqual({
      videoId: "4809",
      lang: "nn",
    });
    const audioResult = parseOembedUrl("https://www.test.ndla.no/nn/embed-iframe/audio/4809");
    expect(audioResult).toEqual({
      audioId: "4809",
      lang: "nn",
    });
    const imageResult = parseOembedUrl("https://www.test.ndla.no/nn/embed-iframe/image/4809");
    expect(imageResult).toEqual({
      imageId: "4809",
      lang: "nn",
    });
    const conceptResult = parseOembedUrl("https://www.test.ndla.no/nn/embed-iframe/concept/4809");
    expect(conceptResult).toEqual({
      conceptId: "4809",
      lang: "nn",
    });
    const h5pResult = parseOembedUrl("https://www.test.ndla.no/nn/embed-iframe/h5p/4809");
    expect(h5pResult).toEqual({
      h5pId: "4809",
      lang: "nn",
    });
  });
  it("supports article-iframe paths with with only article ID", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/article-iframe/article/4809");
    expect(result).toEqual({
      articleId: "4809",
    });
  });
  it("supports article-iframe paths with language prefix and article id", () => {
    const result = parseOembedUrl("https://www.test.ndla.no/nn/article-iframe/article/4809");
    expect(result).toEqual({
      articleId: "4809",
      lang: "nn",
    });
  });
  it("supports article-iframe with taxonomy id", () => {
    const result = parseOembedUrl("https://test.ndla.no/article-iframe/urn:resource:1:89279/1200");
    expect(result).toEqual({
      articleId: "1200",
      nodeId: "urn:resource:1:89279",
    });
  });
  it("supports article-iframe with language prefix and taxonomy id", () => {
    const result = parseOembedUrl("https://test.ndla.no/article-iframe/nn/urn:resource:1:89279/1200");
    expect(result).toEqual({
      articleId: "1200",
      nodeId: "urn:resource:1:89279",
      lang: "nn",
    });
  });
  it("supports topics with context id", () => {
    const result = parseOembedUrl("https://test.ndla.no/e/49c71baf39");
    expect(result).toEqual({
      contextId: "49c71baf39",
    });
  });
  it("supports topics with context id and language prefix", () => {
    const result = parseOembedUrl("https://test.ndla.no/nn/e/49c71baf39");
    expect(result).toEqual({
      contextId: "49c71baf39",
      lang: "nn",
    });
  });
  it("supports topics with context id when name and root are present", () => {
    const result = parseOembedUrl("https://test.ndla.no/e/praktisk-yrkesutovelse-ba-bat-vg1/yrkesutovelse/49c71baf39");
    expect(result).toEqual({
      contextId: "49c71baf39",
      root: "praktisk-yrkesutovelse-ba-bat-vg1",
      name: "yrkesutovelse",
    });
  });
  it("supports resources with context id", () => {
    const result = parseOembedUrl("https://test.ndla.no/r/ee08971f7e");
    expect(result).toEqual({
      contextId: "ee08971f7e",
    });
  });
  it("supports resources with context id and language prefix", () => {
    const result = parseOembedUrl("https://test.ndla.no/nn/r/ee08971f7e");
    expect(result).toEqual({
      contextId: "ee08971f7e",
      lang: "nn",
    });
  });
  it("supports resources with context id when name and root are present", () => {
    const result = parseOembedUrl(
      "https://test.ndla.no/r/praktisk-yrkesutovelse-ba-bat-vg1/legging-av-plen-med-ferdiggras/ee08971f7e",
    );
    expect(result).toEqual({
      contextId: "ee08971f7e",
      root: "praktisk-yrkesutovelse-ba-bat-vg1",
      name: "legging-av-plen-med-ferdiggras",
    });
  });
  it("supports plain article paths", () => {
    const result = parseOembedUrl("https://test.ndla.no/article/4809");
    expect(result).toEqual({
      articleId: "4809",
    });
  });
  it("supports plain article paths with language prefix", () => {
    const result = parseOembedUrl("https://test.ndla.no/nn/article/4809");
    expect(result).toEqual({
      articleId: "4809",
      lang: "nn",
    });
  });
  it("supports plain embed paths", () => {
    const videoResult = parseOembedUrl("https://test.ndla.no/video/4809");
    expect(videoResult).toEqual({
      videoId: "4809",
    });
    const audioResult = parseOembedUrl("https://test.ndla.no/audio/4809");
    expect(audioResult).toEqual({
      audioId: "4809",
    });
    const imageResult = parseOembedUrl("https://test.ndla.no/image/4809");
    expect(imageResult).toEqual({
      imageId: "4809",
    });
    const conceptResult = parseOembedUrl("https://test.ndla.no/concept/4809");
    expect(conceptResult).toEqual({
      conceptId: "4809",
    });
    const h5pId = parseOembedUrl("https://test.ndla.no/h5p/4809");
    expect(h5pId).toEqual({
      h5pId: "4809",
    });
  });
  it("supports plain embed paths with language prefix", () => {
    const videoResult = parseOembedUrl("https://test.ndla.no/nn/video/4809");
    expect(videoResult).toEqual({
      videoId: "4809",
      lang: "nn",
    });
    const audioResult = parseOembedUrl("https://test.ndla.no/nn/audio/4809");
    expect(audioResult).toEqual({
      audioId: "4809",
      lang: "nn",
    });
    const imageResult = parseOembedUrl("https://test.ndla.no/nn/image/4809");
    expect(imageResult).toEqual({
      imageId: "4809",
      lang: "nn",
    });
    const conceptResult = parseOembedUrl("https://test.ndla.no/nn/concept/4809");
    expect(conceptResult).toEqual({
      conceptId: "4809",
      lang: "nn",
    });
    const h5pId = parseOembedUrl("https://test.ndla.no/nn/h5p/4809");
    expect(h5pId).toEqual({
      h5pId: "4809",
      lang: "nn",
    });
  });
});

test("isCurrentPage", () => {
  // Without learningstep id
  expect(
    isCurrentPage(
      "/subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70/topic:1:11f13e74-7cb8-4651-8d10-0927e7a9de48/topic:1:2bd24a78-b09c-4249-b9a2-a98e6364bfd9",
      {
        url: "/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe",
      },
    ),
  ).toBe(false);
  expect(
    isCurrentPage("/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe", {
      url: "/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe",
    }),
  ).toBe(true);
  // With learningstep id
  expect(
    isCurrentPage(
      "/subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1/topic:2:182777/topic:1:7db324c6-b6e1-45eb-acd4-34ae29d0a79c/resource:1:178554/1269",
      {
        url: "/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4",
      },
    ),
  ).toBe(false);
  expect(
    isCurrentPage("/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4/1269", {
      url: "/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4",
    }),
  ).toBe(true);
});
