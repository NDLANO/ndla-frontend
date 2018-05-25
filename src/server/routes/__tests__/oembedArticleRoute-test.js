/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { parseAndMatchUrl, oembedArticleRoute } from '../oembedArticleRoute';

const validArticleUrl1 =
  'https://ndla-frontend.test.api.ndla.no/subjects/subject:3/topic:1:55163/topic:1:168398/resource:1:1682';
const validArticleUrl2 =
  'http://localhost:3000/subjects/subject:3/topic:1:168542/topic:1:173292/resource:1:168554';
const validArticleUrl3 =
  'http://localhost:3000/subjects/subject:3/topic:1:168542/resource:1:168554';
const validArticleUrl4 =
  'https://ndla-frontend.test.api.ndla.no/unknown/subjects/subject:3/topic:1:55163/topic:1:168398/resource:1:1682';

const validArticleUrlWithLang =
  'https://ndla-frontend.test.api.ndla.no/nn/subjects/subject:3/topic:1:55163/topic:1:168398/resource:1:1682';
const unvalidArticleUrl =
  'https://ndla-frontend.test.api.ndla.no/subjects/subject:3/topic:1:55163';

const validateSimpleArticlePath1 =
  'https://ndla-frontend.test.api.ndla.no/article/4809';
const validateSimpleArticlePath2 =
  'https://ndla-frontend.test.api.ndla.no/nn/article/4809';

const unvalidateSimpleArticlePath =
  'https://ndla-frontend.test.api.ndla.no/articles/4809';

test('parseAndMatchUrl', () => {
  expect(parseAndMatchUrl(validArticleUrl1)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrl2)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrl3)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrl4)).toMatchSnapshot();
  expect(parseAndMatchUrl(validArticleUrlWithLang)).toMatchSnapshot();
  expect(parseAndMatchUrl(unvalidArticleUrl)).toBe(null);
  expect(parseAndMatchUrl(validateSimpleArticlePath1)).toMatchSnapshot();
  expect(parseAndMatchUrl(validateSimpleArticlePath2)).toMatchSnapshot();
  expect(parseAndMatchUrl(unvalidateSimpleArticlePath)).toBe(null);
});

test('oembedArticleRoute success', async () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:1:1682/?language=nb')
    .reply(200, {
      id: 'urn:resource:1',
      contentUri: 'urn:article:123',
      title: 'Resource title',
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
