/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import serializer from 'jest-emotion';
import IntlProvider from '@ndla/i18n';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import { getLocaleObject } from '../../../i18n';

expect.addSnapshotSerializer(serializer);

jest.mock('../../../config', () => ({
  zendeskWidgetKey: '123',
}));

test('ErrorPage renderers correctly', () => {
  const locale = getLocaleObject('nb');
  const component = renderer.create(
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <BrowserRouter>
        <ErrorPage locale="nb" location={{ pathname: '/' }} />
      </BrowserRouter>
    </IntlProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
