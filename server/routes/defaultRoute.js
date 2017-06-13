/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import defined from 'defined';

import IntlProvider from '../../src/components/IntlProvider';
import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Html from '../helpers/Html';
import routes from '../../src/routes';
import configureStore from '../../src/configureStore';
import rootSaga from '../../src/sagas';
import { getLocaleObject, isValidLocale } from '../../src/i18n';
import { storeAccessToken } from '../../src/util/apiHelpers';

const renderHtmlString = (
  locale,
  userAgentString,
  state = {},
  component = undefined,
) =>
  renderToString(
    <Html
      lang={locale}
      state={state}
      component={component}
      className={getConditionalClassnames(userAgentString)}
    />,
  );

export function defaultRoute(req, res, token) {
  storeAccessToken(token.access_token);
  const paths = req.url.split('/');
  const { abbreviation: locale, messages } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  if (__DISABLE_SSR__) {
    // eslint-disable-line no-underscore-dangle
    const htmlString = renderHtmlString(locale, userAgentString, {
      locale,
    });
    res.send(`<!doctype html>\n${htmlString}`);
    return;
  }

  const store = configureStore({ locale });

  const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

  const context = {};
  const component = (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <StaticRouter basename={basename} location={req.url} context={context}>
          {routes}
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    store
      .runSaga(rootSaga)
      .done.then(() => {
        const state = store.getState();
        const htmlString = renderHtmlString(
          locale,
          userAgentString,
          state,
          component,
        );
        const status = defined(context.status, 200);
        res.status(status).send(`<!doctype html>\n${htmlString}`);
      })
      .catch(error => {
        res.status(500).send(error.message);
      });
  }

  // Trigger sagas for components by rendering them
  // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
  renderToString(component);

  // Dispatch a close event so sagas stop listening after they have resolved
  store.close();
}
