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
import { resetIdCounter } from 'ndla-tabs';
import { OK, MOVED_PERMANENTLY, INTERNAL_SERVER_ERROR } from 'http-status';
import Helmet from 'react-helmet';
import { ApolloProvider } from 'react-apollo';

import queryString from 'query-string';
import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Document from '../helpers/Document';
import routes, { routes as serverRoutes } from '../../routes';
import configureStore from '../../configureStore';
import config from '../../config';
import { createApolloClient } from '../../util/apiHelpers';
import handleError from '../../util/handleError';
import ErrorPage from '../../containers/ErrorPage';
import { getLocaleInfoFromPath } from '../../i18n';

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

const renderPage = (Page, data = {}) => {
  resetIdCounter();
  const html = renderToString(Page);
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets: getAssets(),
    // Following is serialized to window.DATA
    data: {
      ...data,
      config,
      assets: getAssets(),
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
  const { html, ...docProps } = renderPage(Page, {
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

async function renderError(req, status = INTERNAL_SERVER_ERROR) {
  const { abbreviation, messages } = getLocaleInfoFromPath(req.path);

  const context = { status };
  const Page = (
    <IntlProvider locale={abbreviation} messages={messages}>
      <ErrorPage local={abbreviation} />
    </IntlProvider>
  );

  const { html, helmet, data } = renderPage(Page);

  return {
    html,
    docProps: {
      assets: {
        css: assets.client.css ? assets.client.css : undefined,
        js: assets.injectCss ? [assets.injectCss.js] : [], // Error page is a static page, only use js to inject css under development
      },
      data,
      helmet,
    },
    context,
  };
}

async function doRender(req, renderFn) {
  const userAgentString = req.headers['user-agent'];
  const className = getConditionalClassnames(userAgentString);

  const rendered = await renderFn(req);

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

export async function defaultRoute(req) {
  return doRender(req, render);
}

export async function errorRoute(req) {
  return doRender(req, renderError);
}
