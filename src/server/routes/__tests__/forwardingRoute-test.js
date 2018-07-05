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

test('forwardingRoute redirect with 301 if mapping OK', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/url/mapping?url=ndla.no/nb/node/1337')
    .reply(200, {
      path: '/subject:3/topic:1:55212/topic:1:175218/resource:1:72007',
    });

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    {
      originalUrl: '/nb/node/1337',
    },
    { redirect },
    next,
  );

  expect(
    redirect.calledWith(
      301,
      `/nb/subjects/subject:3/topic:1:55212/topic:1:175218/resource:1:72007`,
    ),
  ).toBe(true);
  expect(next.notCalled).toBe(true);
});

test('forwardingRoute call next if mapping fails', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/url/mapping?url=ndla.no/nb/node/1337')
    .reply(404);

  const next = sinon.spy();
  const redirect = sinon.spy();

  await forwardingRoute(
    {
      originalUrl: '/nb/node/1337',
    },
    { redirect },
    next,
  );

  expect(redirect.notCalled).toBe(true);
  expect(next.calledOnce).toBe(true);
});
