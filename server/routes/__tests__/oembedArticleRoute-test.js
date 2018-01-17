/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import sinon from 'sinon';
import { parseAndMatchUrl, oembedArticleRoute } from '../oembedArticleRoute';

const response = {
  setHeader: jest.fn(),
  status: jest.fn(),
  json: jest.fn(),
};
response.status.mockImplementation(() => response);

const validArticleUrl1 =
  'https://ndla-frontend.test.api.ndla.no/article/urn:subject:3/urn:topic:1:55163/urn:topic:1:168398/urn:resource:1:1682/26050';
const validArticleUrl2 =
  'http://localhost:3000/article/urn:subject:3/urn:topic:1:168542/urn:topic:1:173292/urn:resource:1:168554/127';

const validArticleUrlWithLang =
  'https://ndla-frontend.test.api.ndla.no/nn/article/urn:subject:3/urn:topic:1:55163/urn:topic:1:168398/urn:resource:1:1682/26050';
const unvalidArticleUrl =
  'https://ndla-frontend.test.api.ndla.no/subjects/urn:subject:3/urn:topic:1:55163';

test('parseAndMatchUrl', () => {
  expect(parseAndMatchUrl(validArticleUrl1)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrl2)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrlWithLang)).toMatchSnapshot();
  expect(parseAndMatchUrl(unvalidArticleUrl)).toBe(null);
});

test('oembedArticleRoute success', async () => {
  nock('http://ndla-api')
    .get('/article-converter/json/nb/26050')
    .reply(200, { id: 123, title: 'unit test', metaData: {} });

  const spy = sinon.spy(response, 'json');
  await oembedArticleRoute(
    {
      query: {
        url: validArticleUrl1,
      },
    },
    response,
    { access_token: '123' },
  );

  expect(spy.calledOnce).toBe(true);
  expect(spy.getCall(0).args[0]).toMatchSnapshot();
  spy.restore();
});

test('oembedArticleRoute invalid url', async () => {
  const spy = sinon.spy(response, 'json');

  await oembedArticleRoute(
    {
      query: {
        url: unvalidArticleUrl,
      },
    },
    response,
    { access_token: '123' },
  );

  expect(spy.calledOnce).toBe(true);
  expect(spy.getCall(0).args[0]).toMatchSnapshot();
  spy.restore();
});
