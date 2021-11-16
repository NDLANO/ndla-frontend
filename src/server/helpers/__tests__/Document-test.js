/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import renderer from 'react-test-renderer';
import { Helmet } from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import Document from '../Document';

test('Document renderers correctly', () => {
  // Render page with Helmet component
  renderer.create(
    <PageContainer locale="nb" t={() => 'dummy text'}>
      <h1>Hello World</h1>

      <Helmet
        htmlAttributes={{ lang: 'nb' }}
        title="NDLA test title"
        meta={[{ name: 'description', content: 'NDLA meta description' }]}
      />
    </PageContainer>,
  );

  // Pretend we are serverside and render static
  const helmet = Helmet.renderStatic();

  // Create and render Document. Match snapshot of rendered document.
  const component = renderer.create(
    <Document
      locale="nb"
      data={{}}
      helmet={helmet}
      assets={{
        css: '/main.css',
        js: [{ src: '/client.js' }, { src: '/vendor.js' }],
        polyfill: { src: '/polyfill.js' },
      }}
    />,
  );

  // Match snapshot for rendered Document. Should contain title, html lang,
  // and meta description from PageContainer > Helmet.
  expect(component.toJSON()).toMatchSnapshot();
});
