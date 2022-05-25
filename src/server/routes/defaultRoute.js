/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server.js';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import url from 'url';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';

import RedirectContext from '../../components/RedirectContext';
import App from '../../App';
import config from '../../config';
import { createApolloClient } from '../../util/apiHelpers';
import { getLocaleInfoFromPath, initializeI18n } from '../../i18n';
import { renderHtml, renderPageWithData } from '../helpers/render';
import { EmotionCacheKey } from '../../constants';
import { VersionHashProvider } from '../../components/VersionHashContext';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

const getAssets = () => ({
  css: assets.client.css ? assets.client.css[0] : undefined,
  polyfill: { src: assets.polyfill.js[0] },
  js: [{ src: assets.client.js[0] }],
  mathJaxConfig: { js: assets.mathJaxConfig.js[0] },
});

const disableSSR = req => {
  const urlParts = url.parse(req.url, true);
  if (config.disableSSR) {
    return true;
  }
  return urlParts.query && urlParts.query.disableSSR === 'true';
};

async function doRender(req) {
  global.assets = assets; // used for including mathjax js in pages with math
  let initialProps = { loading: true, resCookie: req.headers['cookie'] };
  const versionHash = req.query.versionHash;
  const { abbreviation: locale, basename } = getLocaleInfoFromPath(req.path);

  const client = createApolloClient(
    locale,
    initialProps.resCookie,
    versionHash,
  );

  const cache = createCache({ key: EmotionCacheKey });
  const context = {};

  const i18n = initializeI18n(i18nInstance, locale);

  const helmetContext = {};
  const Page = !disableSSR(req) ? (
    <RedirectContext.Provider value={context}>
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <CacheProvider value={cache}>
              <VersionHashProvider value={versionHash}>
                <StaticRouter basename={basename} location={req.url}>
                  <App
                    initialProps={initialProps}
                    isClient={false}
                    client={client}
                    locale={locale}
                    versionHash={versionHash}
                    key={locale}
                  />
                </StaticRouter>
              </VersionHashProvider>
            </CacheProvider>
          </ApolloProvider>
        </I18nextProvider>
      </HelmetProvider>
    </RedirectContext.Provider>
  ) : (
    <HelmetProvider context={helmetContext}>{''}</HelmetProvider>
  );

  const apolloState = client.extract();
  const docProps = await renderPageWithData(
    Page,
    getAssets(),
    {
      initialProps,
      apolloState,
      serverPath: req.path,
      serverQuery: req.query,
    },
    cache,
    client,
  );

  return {
    docProps,
    html: docProps.html,
    context,
    helmetContext,
  };
}

export async function defaultRoute(req) {
  const { html, context, docProps, helmetContext } = await doRender(req);
  return renderHtml(req, html, context, docProps, helmetContext);
}
