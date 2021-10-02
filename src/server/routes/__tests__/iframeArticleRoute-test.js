/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
  const response = await iframeArticleRoute({
    params: {
      lang: 'nb',
      articleId: '26050',
      taxonomyId: 'urn:resource:123',
    },
    headers: {
      'user-agent': 'Mozilla/5.0 Gecko/20100101 Firefox/58.0',
    },
    url: '/article-iframe/nb/urn:resource:123/26050',
  });

  expect(response).toMatchSnapshot();
});
