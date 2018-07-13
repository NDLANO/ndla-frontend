/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { matchPath } from 'react-router-dom';
import IntlProvider from 'ndla-i18n';
import url from 'url';
import { ApolloProvider } from 'react-apollo';

import queryString from 'query-string';
import routes, { routes as serverRoutes } from '../../routes';
import configureStore from '../../configureStore';
import config from '../../config';
import { createApolloClient } from '../../util/apiHelpers';
import handleError from '../../util/handleError';
import { getLocaleInfoFromPath } from '../../i18n';
import { renderHtml, renderPage } from '../helpers/render';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

const getAssets = () => ({
  css: assets.client.css ? assets.client.css : undefined,
  js: [assets.client.js],
});

async function loadGetInitialProps(Component, ctx) {
  if (!Component.getInitialProps) return { loading: false };

  try {
    const initialProps = await Component.getInitialProps(ctx);
    return { ...initialProps, loading: false };
  } catch (e) {
    handleError(e);
    return { loading: false };
  }
}

const disableSSR = req => {
  const urlParts = url.parse(req.url, true);
  if (config.disableSSR) {
    return true;
  }
  return urlParts.query && urlParts.query.disableSSR === 'true';
};

async function doRender(req) {
  global.assets = assets; // used for including mathjax js in pages with math
  let initialProps = { loading: true };
  const {
    abbreviation: locale,
    messages,
    basepath,
    basename,
  } = getLocaleInfoFromPath(req.path);

  const store = configureStore({ locale });
  const client = createApolloClient(locale);

  if (!disableSSR(req)) {
    const route = serverRoutes.find(r => matchPath(basepath, r));
    const match = matchPath(basepath, route);
    initialProps = await loadGetInitialProps(route.component, {
      isServer: true,
      locale,
      store,
      match,
      client,
      location: {
        search: `?${queryString.stringify(req.query)}`,
      },
    });
  }

  const context = {};
  const Page = !disableSSR(req) ? (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <IntlProvider locale={locale} messages={messages}>
          <StaticRouter
            basename={basename}
            location={req.url}
            context={context}>
            {routes(initialProps, locale)}
          </StaticRouter>
        </IntlProvider>
      </ApolloProvider>
    </Provider>
  ) : (
    ''
  );

  const apolloState = client.extract();
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
    initialState: store.getState(),
    apolloState,
  });

  return {
    html,
    docProps,
    context,
  };
}

export async function defaultRoute(req) {
  const { html, context, docProps } = await doRender(req);
  return renderHtml(req, html, context, docProps);
}
