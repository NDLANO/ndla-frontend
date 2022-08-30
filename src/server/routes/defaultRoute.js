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
import { getSelectorsByUserAgent } from 'react-device-detect';
import { i18nInstance } from '@ndla/ui';
import url from 'url';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import { getCookie } from '@ndla/util';

import RedirectContext from '../../components/RedirectContext';
import App from '../../App';
import config from '../../config';
import { createApolloClient } from '../../util/apiHelpers';
import {
  getLocaleInfoFromPath,
  initializeI18n,
  isValidLocale,
} from '../../i18n';
import { renderHtml, renderPageWithData } from '../helpers/render';
import { EmotionCacheKey, STORED_LANGUAGE_COOKIE_KEY } from '../../constants';
import { VersionHashProvider } from '../../components/VersionHashContext';
import IsMobileContext from '../../IsMobileContext';
import { TEMPORARY_REDIRECT } from '../../statusCodes';

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
  const resCookie = req.headers['cookie'] ?? '';
  const userAgent = req.headers['user-agent'];
  const isMobile = getSelectorsByUserAgent(userAgent).isMobile;
  const versionHash = req.query.versionHash;
  const { basename } = getLocaleInfoFromPath(req.path);
  const locale = getCookie(STORED_LANGUAGE_COOKIE_KEY, resCookie);

  const client = createApolloClient(locale, resCookie, versionHash);

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
              <VersionHashProvider value={!!versionHash}>
                <IsMobileContext.Provider value={isMobile}>
                  <StaticRouter basename={basename} location={req.url}>
                    <App
                      isClient={false}
                      client={client}
                      locale={locale}
                      versionHash={versionHash}
                      resCookie={resCookie}
                      key={locale}
                    />
                  </StaticRouter>
                </IsMobileContext.Provider>
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
      resCookie,
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
  const resCookie = req.headers['cookie'] ?? '';
  const { basename, basepath } = getLocaleInfoFromPath(req.path);
  const cookieLocale = getCookie(STORED_LANGUAGE_COOKIE_KEY, resCookie) ?? '';
  const locale =
    cookieLocale.length && isValidLocale(cookieLocale) ? cookieLocale : 'nb';
  if ((locale === 'nb' && basename === '') || locale === basename) {
    const { html, context, docProps, helmetContext } = await doRender(req);
    return renderHtml(req, html, context, docProps, helmetContext);
  }

  return {
    status: TEMPORARY_REDIRECT,
    data: { Location: `/${locale}${basepath}` },
  };
}
