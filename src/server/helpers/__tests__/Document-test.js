/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { render } from '@testing-library/react';
import { PageContainer } from '@ndla/ui';
import Document from '../Document';

HelmetProvider.canUseDOM = false;

test('Document renderers correctly', () => {
  const helmetContext = {};
  // Render page with Helmet component
  render(
    <HelmetProvider context={helmetContext}>
      <PageContainer>
        <h1>Hello World</h1>
        <Helmet
          htmlAttributes={{ lang: 'nb' }}
          title="NDLA test title"
          meta={[{ name: 'description', content: 'NDLA meta description' }]}
        />
      </PageContainer>
    </HelmetProvider>,
  );

  // Create and render Document. Match snapshot of rendered document.
  const { container } = render(
    <Document
      locale="nb"
      data={{}}
      helmet={helmetContext.helmet}
      assets={{
        css: '/main.css',
        js: [{ src: '/client.js' }, { src: '/vendor.js' }],
      }}
    />,
  );
  const header = container.querySelector('html');

  // Match snapshot for rendered Document. Should contain title, html lang,
  // and meta description from PageContainer > Helmet.
  expect(header).toMatchSnapshot();
});
