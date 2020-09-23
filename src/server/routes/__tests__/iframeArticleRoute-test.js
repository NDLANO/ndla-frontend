/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import nock from 'nock';
import { iframeArticleRoute } from '../iframeArticleRoute';

jest.mock('../../helpers/Document', () => () => (
  <html lang="en">
    <body>REPLACE_ME</body>
  </html>
));

jest.mock('../../../iframe/IframePage', () =>
  // eslint-disable-next-line react/prop-types
  ({ status }) => (
    <div>
      <p>{status}</p>
    </div>
  ),
);

test('iframeArticleRoute 200 OK', async () => {
  nock('http://ndla-api')
    .get('/article-converter/json/nb/26050')
    .query({ removeRelatedContent: true })
    .reply(200, {
      id: 123,
      title: 'unit test',
    });

  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:123/resource-types/?language=nb')
    .reply(200, [{ id: '1234', name: 'Type' }]);

  const response = await iframeArticleRoute({
    params: {
      lang: 'nb',
      articleId: '26050',
      taxonomyId: 'urn:resource:123',
    },
    query: {
      removeRelatedContent: true,
    },
    headers: {
      'user-agent': 'Mozilla/5.0 Gecko/20100101 Firefox/58.0',
    },
  });

  expect(response).toMatchSnapshot();
});

test('iframeArticleRoute 500 Internal server error', async () => {
  nock('http://ndla-api')
    .get('/article-converter/json/nb/26050')
    .query({ removeRelatedContent: true })
    .replyWithError('something awful happened');

  const response = await iframeArticleRoute({
    params: {
      lang: 'nb',
      articleId: '26050',
      taxonomyId: '123',
    },
    query: {
      removeRelatedContent: true,
    },
    headers: {
      'user-agent': 'Mozilla/5.0 Gecko/20100101 Firefox/58.0',
    },
  });

  expect(response).toMatchSnapshot();
});
