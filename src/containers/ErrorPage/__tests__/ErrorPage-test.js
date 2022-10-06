/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server.js';
import renderer from 'react-test-renderer';
import { createSerializer } from '@emotion/jest';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import ErrorPage from '../ErrorPage';
import { initializeI18n } from '../../../i18n';

HelmetProvider.canUseDOM = false;
expect.addSnapshotSerializer(createSerializer());

jest.mock('../../../config', () => ({
  zendeskWidgetKey: '123',
}));

test('ErrorPage renderers correctly', () => {
  const i18n = initializeI18n(i18nInstance, 'nb');
  const component = renderer.create(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <StaticRouter>
          <ErrorPage />
        </StaticRouter>
      </I18nextProvider>
    </HelmetProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
