/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { oembedArticleRoute } from '../oembedArticleRoute';

const validArticleUrl1 =
  'https://ndla-frontend.test.api.ndla.no/subjects/subject:3/topic:1:55163/topic:1:168398/resource:1:1682';
const unvalidArticleUrl =
  'https://ndla-frontend.test.api.ndla.no/subjects/subject:3/topic:1:55163';

test('oembedArticleRoute success', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:1:1682/?language=nb')
    .reply(200, {
      id: 'urn:resource:1',
      contentUri: 'urn:article:123',
      name: 'Resource title',
    });

  const response = await oembedArticleRoute({
    query: {
      url: validArticleUrl1,
    },
  });

  expect(response).toMatchSnapshot();
});

test('oembedArticleRoute invalid url', async () => {
  const response = await oembedArticleRoute({
    query: {
      url: unvalidArticleUrl,
    },
  });

  expect(response).toMatchSnapshot();
});
