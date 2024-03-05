/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import nock from "nock";
import { oembedArticleRoute } from "../oembedArticleRoute";

const validArticleUrl1 = "https://test.ndla.no/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
const validArticleUrl2 = "https://test.ndla.no/subjects/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
const unvalidArticleUrl = "https://test.ndla.no/subject:3";

test("oembedArticleRoute success", async () => {
  nock("http://ndla-api").get("/taxonomy/v1/nodes/urn:resource:1:1682?language=nb").times(2).reply(200, {
    id: "urn:resource:1",
    contentUri: "urn:article:123",
    name: "Resource title",
  });

  const response = await oembedArticleRoute({
    query: {
      url: validArticleUrl1,
    },
  } as any as Request);

  expect(response).toMatchSnapshot();

  const response2 = await oembedArticleRoute({
    query: {
      url: validArticleUrl2,
    },
  } as any as Request);

  expect(response2).toMatchSnapshot();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("oembedArticleRoute invalid url", async () => {
  const response = await oembedArticleRoute({
    query: {
      url: unvalidArticleUrl,
    },
  } as any as Request);

  expect(response).toMatchSnapshot();
});
