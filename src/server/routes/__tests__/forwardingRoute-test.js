/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import sinon from 'sinon';
import { forwardingRoute } from '../forwardingRoute';

function prepareNock(status, nodeId = '1337') {
  if (status === 200) {
    return nock('http://ndla-api')
      .get(`/taxonomy/v1/url/mapping?url=ndla.no/node/${nodeId}`)
      .reply(200, {
        path: '/subject:3/topic:1:55212/topic:1:175218/resource:1:72007',
      });
  }
  return nock('http://ndla-api')
    .get(`/taxonomy/v1/url/mapping?url=ndla.no/node/${nodeId}`)
    .reply(404);
}

test('forwardingRoute redirect with 301 if mapping OK', async () => {
  prepareNock(200);

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute({ params: { nodeId: '1337' } }, { redirect }, next);

  expect(
    redirect.calledWith(
      301,
      `/subjects/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`,
    ),
  ).toBe(true);
  expect(next.notCalled).toBe(true);
});

test('forwardingRoute redirect with 301 if mapping OK (nb)', async () => {
  prepareNock(200);

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    { params: { lang: 'nb', nodeId: '1337' } },
    { redirect },
    next,
  );

  expect(
    redirect.calledWith(
      301,
      `/subjects/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`,
    ),
  ).toBe(true);
  expect(next.notCalled).toBe(true);
});

test('forwardingRoute redirect with 301 if mapping OK (en)', async () => {
  prepareNock(200);

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    { params: { lang: 'en', nodeId: '1337' } },
    { redirect },
    next,
  );

  expect(
    redirect.calledWith(
      301,
      `/en/subjects/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`,
    ),
  ).toBe(true);
  expect(next.notCalled).toBe(true);
});

test('forwardingRoute redirect with 301 if mapping OK (nn)', async () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/external_ids/1337')
    .reply(200, {
      articleId: 2602,
      externalIds: ['1339', '1337'],
    });
  prepareNock(200, '1339');

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    { params: { lang: 'nn', nodeId: '1337' } },
    { redirect },
    next,
  );

  expect(
    redirect.calledWith(
      301,
      `/nn/subjects/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`,
    ),
  ).toBe(true);
  expect(next.notCalled).toBe(true);
});

test('forwardingRoute call next if mapping fails', async () => {
  prepareNock(404);

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    { params: { lang: 'nb', nodeId: '1337' } },
    { redirect },
    next,
  );

  expect(redirect.notCalled).toBe(true);
  expect(next.calledOnce).toBe(true);
});
