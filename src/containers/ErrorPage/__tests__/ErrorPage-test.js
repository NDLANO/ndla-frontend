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
      <ErrorPage locale="nb" location={{ pathname: '/' }} />
    </IntlProvider>,
  );

  expect(component.toJSON()).toMatchSnapshot();
});
