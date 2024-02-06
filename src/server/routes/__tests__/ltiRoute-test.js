/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ltiRoute, parseAndValidateParameters } from "../ltiRoute";

test("ltiRoute 200 OK ", async () => {
  const body = {
    lti_message_type: "basic-lti-launch-request",
    lti_version: "LTI-1p0",
    launch_presentation_return_url: "http://ndla-api/some-return-url",
    launch_presentation_document_target: "iframe",
    launch_presentation_height: "800",
    launch_presentation_width: "1200",
  };
  const response = await ltiRoute({
    params: {
      lang: "nb",
      articleId: "26050",
      resourceId: "urn:resource:123",
    },
    body,
    method: "POST",
    headers: {
      "user-agent": "Mozilla/5.0 Gecko/20100101 Firefox/58.0",
    },
  });

  expect(response.status).toBe(200);
});

test("ltiRoute 200 OK only required params", async () => {
  const body = {
    lti_message_type: "basic-lti-launch-request",
    lti_version: "LTI-1p0",
  };
  const response = await ltiRoute({
    params: {
      lang: "nb",
      articleId: "26050",
      resourceId: "urn:resource:123",
    },
    body,
    method: "POST",
    headers: {
      "user-agent": "Mozilla/5.0 Gecko/20100101 Firefox/58.0",
    },
  });

  expect(response.status).toBe(200);
});

test("ltiRoute 400 BAD REQUEST", async () => {
  const body = {
    lti_message_type: "basic-lti-launch-request",
    launch_presentation_return_url: "http://ndla-api/some-return-url",
    launch_presentation_document_target: "iframe",
    launch_presentation_height: "800",
    launch_presentation_width: "1200",
  };
  const response = await ltiRoute({
    params: {
      lang: "nb",
      articleId: "26050",
      resourceId: "urn:resource:123",
    },
    method: "POST",
    body,
    headers: {
      "user-agent": "Mozilla/5.0 Gecko/20100101 Firefox/58.0",
    },
  });

  expect(response).toMatchSnapshot();
});

test("ltiRoute 400 BAD REQUEST wrong values", async () => {
  const body = {
    lti_message_type: "basic-lti-launch-request",
    lti_version: "wrong version",
    launch_presentation_return_url: "http://ndla-api/some-return-url",
    launch_presentation_document_target: "iframe",
    launch_presentation_height: "800",
    launch_presentation_width: "1200",
  };
  const response = await ltiRoute({
    params: {
      lang: "nb",
      articleId: "26050",
      resourceId: "urn:resource:123",
    },
    method: "POST",
    body,
    headers: {
      "user-agent": "Mozilla/5.0 Gecko/20100101 Firefox/58.0",
    },
  });

  expect(response).toMatchSnapshot();
});

test("parseAndValidateParameters no errors", () => {
  const body = {
    lti_message_type: "basic-lti-launch-request",
    lti_version: "LTI-1p0",
    launch_presentation_return_url: "http://ndla-api/some-return-url",
    launch_presentation_document_target: "iframe",
    launch_presentation_height: "800",
    launch_presentation_width: "1200",
  };
  const result = parseAndValidateParameters(body);
  expect(result).toMatchSnapshot();
});

test("parseAndValidateParameters errors", () => {
  const body = {};
  const result = parseAndValidateParameters(body);
  expect(result).toMatchSnapshot();
});
