/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { CompatRouter } from 'react-router-dom-v5-compat';
import { StaticRouter } from 'react-router';
import renderer from 'react-test-renderer';
import serializer from 'jest-emotion';
import { I18nextProvider, Translation } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import ErrorPage from '../ErrorPage';

expect.addSnapshotSerializer(serializer);

jest.mock('../../../config', () => ({
  zendeskWidgetKey: '123',
}));

test('ErrorPage renderers correctly', () => {
  const component = renderer.create(
    <I18nextProvider i18n={i18nInstance}>
      <Translation>
        {(_, { i18n }) => {
          i18n.language = 'nb';
          return (
            <StaticRouter>
              <CompatRouter>
                <ErrorPage locale="nb" location={{ pathname: '/' }} />
              </CompatRouter>
            </StaticRouter>
          );
        }}
      </Translation>
    </I18nextProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
