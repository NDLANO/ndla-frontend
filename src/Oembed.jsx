/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import ErrorReporter from 'ndla-error-reporter';
import IntlProvider from 'ndla-i18n';

import { getLocaleObject } from './i18n';

const locale = getLocaleObject(window.locale);

const {
  disableSSR,
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = window.config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

renderOrHydrate(
  <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
    <div>test</div>
  </IntlProvider>,
  document.getElementById('root'),
);
