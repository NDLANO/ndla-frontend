/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NextFunction, Request, Response } from "express";
import nock from "nock";
import { forwardingRoute } from "../forwardingRoute";

vi.mock("../../../config", () => {
  return {
    default: {
      isNdlaProdEnvironment: true,
      learningPathDomain: "https://stier.test.ndla.no",
      getEnvironmentVariabel: () => {},
      runtimeType: "test",
    },
  };
});

function prepareNock(status: number, nodeId = "1337", contentUri = "urn:article:233", subjectId = "subject:3") {
  if (status === 200) {
    nock("http://ndla-api")
      .get(`/taxonomy/v1/url/mapping?url=ndla.no/node/${nodeId}`)
      .reply(200, {
        path: `/${subjectId}/topic:1:55212/topic:1:175218/resource:1:72007`,
      });

    return nock("http://ndla-api")
      .get(`/taxonomy/v1/url/resolve?path=/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`)
      .reply(200, {
        contentUri,
      });
  }
  return nock("http://ndla-api").get(`/taxonomy/v1/url/mapping?url=ndla.no/node/${nodeId}`).reply(404);
}

test("forwardingRoute redirect with 301 if mapping OK", async () => {
  prepareNock(200);

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute redirect with 301 if mapping OK (nb)", async () => {
  prepareNock(200);

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "nb", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute redirect with 301 if mapping OK (en)", async () => {
  prepareNock(200);

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "en", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `/en/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute redirect with 301 if mapping OK (nn)", async () => {
  nock("http://ndla-api")
    .get("/article-api/v2/articles/external_ids/1337")
    .reply(200, {
      articleId: 2602,
      externalIds: ["1339", "1337"],
    });
  prepareNock(200, "1339");

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "nn", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `/nn/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute redirect learningpath with 301 if mapping OK (nb)", async () => {
  prepareNock(200, "1337", "urn:learningpath:122");

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "nb", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `https://stier.test.ndla.no/learningpaths/122/first-step`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute redirect learningpath with 301 if mapping OK (nn)", async () => {
  nock("http://ndla-api").get("/article-api/v2/articles/external_ids/1337").reply(404);

  prepareNock(200, "1337", "urn:learningpath:122");

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "nn", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).toHaveBeenCalledWith(301, `https://stier.test.ndla.no/nn/learningpaths/122/first-step`);
  expect(next).not.toHaveBeenCalled();
  expect(nock.pendingMocks()).toStrictEqual([]);
});

test("forwardingRoute call next if mapping fails", async () => {
  prepareNock(404);

  const next = vi.fn();
  const redirect = vi.fn();

  await forwardingRoute(
    { params: { lang: "nb", nodeId: "1337" } } as any as Request,
    { redirect } as any as Response,
    next as NextFunction,
  );

  expect(redirect).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);
  expect(nock.pendingMocks()).toStrictEqual([]);
});
