/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import renderer from 'react-test-renderer';
import serializer from 'jest-emotion';
import { I18nextProvider, Translation } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import ErrorPage from '../ErrorPage';

HelmetProvider.canUseDOM = false;
expect.addSnapshotSerializer(serializer);

jest.mock('../../../config', () => ({
  zendeskWidgetKey: '123',
}));

test('ErrorPage renderers correctly', () => {
  const component = renderer.create(
    <HelmetProvider>
      <I18nextProvider i18n={i18nInstance}>
        <Translation>
          {(_, { i18n }) => {
            i18n.language = 'nb';
            return (
              <StaticRouter>
                <ErrorPage />
              </StaticRouter>
            );
          }}
        </Translation>
      </I18nextProvider>
    </HelmetProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
