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
import { bindActionCreators } from 'redux';
import IntlProvider from 'ndla-i18n';
import { getComponentName } from 'ndla-util';
import { resetIdCounter } from 'ndla-tabs';
import { OK, MOVED_PERMANENTLY } from 'http-status';
import Helmet from 'react-helmet';

import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Document from '../helpers/Document';
import routes, { routes as serverRoutes } from '../../src/routes';
import configureStore from '../../src/configureStore';
import config from '../../src/config';

import { getLocaleObject, isValidLocale } from '../../src/i18n';

const assets = config.isProduction
  ? require('../../assets/assets') // eslint-disable-line import/no-unresolved
  : require('../developmentAssets');

const getAssets = () => ({
  favicon: `/assets/${assets['ndla-favicon.png']}`,
  css: config.isProduction ? `/assets/${assets['main.css']}` : undefined,
  js: [
    `/assets/${assets['manifest.js']}`,
    `/assets/${assets['vendor.js']}`,
    `/assets/${assets['main.js']}`,
  ],
  mathJax: `/assets/${assets['mathjax.js']}`,
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

const renderPage = (initialProps, initialState, Page) => {
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
      assets,
      config,
      accessToken: global.access_token,
    },
  };
};

export async function defaultRoute(req) {
  const paths = req.url.split('/');
  const basename = isValidLocale(paths[1]) ? paths[1] : '';
  const path = basename ? req.url.replace(`/${basename}`, '') : req.url;

  const { abbreviation: locale, messages } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];
  const className = getConditionalClassnames(userAgentString);

  const store = configureStore({ locale });

  if (!config.disableSSR) {
    const route = serverRoutes.find(r => matchPath(path, r));
    const match = matchPath(path, route);
    const Component = route.component;
    const actions = Component.mapDispatchToProps
      ? bindActionCreators(Component.mapDispatchToProps, store.dispatch)
      : {};
    await loadGetInitialProps(route.component, {
      isServer: true,
      store,
      ...actions,
      match,
    });
  }

  const context = {};
  const Page = (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <StaticRouter basename={basename} location={req.url} context={context}>
          {routes}
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );

  if (context.url) {
    return {
      status: MOVED_PERMANENTLY,
      data: {
        Location: context.url,
      },
    };
  }

  const status = defined(context.status, OK);
  const { html, ...docProps } = renderPage({}, store.getState(), Page);
  const doc = renderToStaticMarkup(
    <Document className={className} {...docProps} />,
  );

  return {
    status,
    data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
  };
}
