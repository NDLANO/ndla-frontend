/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { matchPath } from 'react-router-dom';
import defined from 'defined';
import IntlProvider from 'ndla-i18n';
import url from 'url';
import { getComponentName } from 'ndla-util';
import { resetIdCounter } from 'ndla-tabs';
import { OK, MOVED_PERMANENTLY } from 'http-status';
import Helmet from 'react-helmet';
import { ApolloProvider } from 'react-apollo';

import queryString from 'query-string';
import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Document from '../helpers/Document';
import routes, { routes as serverRoutes } from '../../routes';
import configureStore from '../../configureStore';
import config from '../../config';
import { createApolloClient } from '../../util/apiHelpers';

import { getLocaleObject, isValidLocale } from '../../i18n';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

const getAssets = () => ({
  css: assets.client.css ? assets.client.css : undefined,
  js: [assets.client.js],
});

async function loadGetInitialProps(Component, ctx) {
  if (!Component.getInitialProps) return {};

  const props = await Component.getInitialProps(ctx);
  if (!props && (!ctx.res || !ctx.res.finished)) {
    const compName = getComponentName(Component);
    const message = `"${compName}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }
  return props;
}

const renderPage = (Page, initialProps, initialState, apolloState) => {
  resetIdCounter();
  const html = config.disableSSR ? '' : renderToString(Page);
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets: getAssets(),
    // Following is serialized to window.DATA
    data: {
      initialProps,
      initialState,
      apolloState,
      config,
      assets,
      accessToken: global.access_token,
    },
  };
};

const disableSSR = req => {
  const urlParts = url.parse(req.url, true);
  if (config.disableSSR) {
    return true;
  }
  return urlParts.query && urlParts.query.disableSSR === 'true';
};

async function render(req) {
  global.assets = assets;
  let initialProps = { loading: true };
  const paths = req.path.split('/');
  const basename = isValidLocale(paths[1]) ? paths[1] : '';
  const path = basename ? req.path.replace(`/${basename}`, '') : req.path;
  const { abbreviation: locale, messages } = getLocaleObject(basename);

  const store = configureStore({ locale });
  const client = createApolloClient(locale);

  if (!disableSSR(req)) {
    const route = serverRoutes.find(r => matchPath(path, r));
    const match = matchPath(path, route);
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
  const Page = (
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
  );

  const apolloState = client.extract();
  const { html, ...docProps } = renderPage(
    Page,
    initialProps,
    store.getState(),
    apolloState,
  );

  return {
    html,
    docProps,
    context,
  };
}

export async function defaultRoute(req) {
  const userAgentString = req.headers['user-agent'];
  const className = getConditionalClassnames(userAgentString);

  const rendered = await render(req);

  const doc = renderToStaticMarkup(
    <Document
      className={className}
      userAgentString={userAgentString}
      {...rendered.docProps}
      useZendesk
    />,
  );

  if (rendered.context.url) {
    return {
      status: MOVED_PERMANENTLY,
      data: {
        Location: rendered.context.url,
      },
    };
  }

  const status = defined(rendered.context.status, OK);

  return {
    status,
    data: `<!doctype html>${doc.replace('REPLACE_ME', rendered.html)}`,
  };
}
