/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import url from 'url';
import { Request } from 'express';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { StaticRouter } from 'react-router-dom/server.js';
import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { i18nInstance } from '@ndla/ui';
import { getCookie } from '@ndla/util';

import App from '../../App';
import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
import { VersionHashProvider } from '../../components/VersionHashContext';
import config from '../../config';
import { EmotionCacheKey, STORED_LANGUAGE_COOKIE_KEY } from '../../constants';
import {
  getLocaleInfoFromPath,
  initializeI18n,
  isValidLocale,
} from '../../i18n';
import { LocaleType } from '../../interfaces';
import { TEMPORARY_REDIRECT } from '../../statusCodes';
import { UserAgentProvider } from '../../UserAgentContext';
import { createApolloClient } from '../../util/apiHelpers';
import { Assets } from '../helpers/Document';
import { renderHtml, renderPageWithData } from '../helpers/render';

//@ts-ignore
const assets = require(process.env.ASSETS_MANIFEST); //eslint-disable-line

const getAssets = (): Assets => ({
  css: assets['client.css'],
  js: [{ src: assets['client.js'] }],
  mathJaxConfig: { js: assets['mathJaxConfig.js'] },
});

const disableSSR = (req: Request) => {
  const urlParts = url.parse(req.url, true);
  if (urlParts.query && urlParts.query.disableSSR) {
    return urlParts.query.disableSSR === 'true';
  }
  return config.disableSSR;
};

async function doRender(req: Request) {
  //@ts-ignore
  global.assets = assets; // used for including mathjax js in pages with math
  const resCookie = req.headers['cookie'] ?? '';
  const userAgent = req.headers['user-agent'];
  const userAgentSelectors = userAgent
    ? getSelectorsByUserAgent(userAgent)
    : undefined;
  const versionHash =
    typeof req.query.versionHash === 'string'
      ? req.query.versionHash
      : undefined;
  const { basename, abbreviation } = getLocaleInfoFromPath(req.path);
  const locale = getCookieLocaleOrFallback(resCookie, abbreviation);
  const noSSR = disableSSR(req);

  const client = createApolloClient(locale, versionHash);

  const cache = createCache({ key: EmotionCacheKey });
  const context: RedirectInfo = {};

  const i18n = initializeI18n(i18nInstance, locale);

  // @ts-ignore
  const helmetContext: FilledContext = {};
  const Page = !noSSR ? (
    <RedirectContext.Provider value={context}>
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <CacheProvider value={cache}>
              <VersionHashProvider value={versionHash}>
                <UserAgentProvider value={userAgentSelectors}>
                  <StaticRouter basename={basename} location={req.url}>
                    <App key={locale} />
                  </StaticRouter>
                </UserAgentProvider>
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
  const docProps = await renderPageWithData({
    Page,
    assets: getAssets(),
    disableSSR: noSSR,
    data: {
      apolloState,
      serverPath: req.path,
      serverQuery: req.query,
    },
    cache,
    client,
  });

  return {
    docProps,
    html: docProps.html,
    context,
    helmetContext,
  };
}

function getCookieLocaleOrFallback(
  resCookie: string,
  abbreviation: LocaleType,
) {
  const cookieLocale = getCookie(STORED_LANGUAGE_COOKIE_KEY, resCookie) ?? '';
  if (cookieLocale.length && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }
  return abbreviation;
}

export async function defaultRoute(req: Request) {
  const resCookie = req.headers['cookie'] ?? '';
  const { basename, basepath, abbreviation } = getLocaleInfoFromPath(
    req.originalUrl,
  );
  const locale = getCookieLocaleOrFallback(resCookie, abbreviation);
  if ((locale === 'nb' && basename === '') || locale === basename) {
    const { html, context, docProps, helmetContext } = await doRender(req);
    return renderHtml(html, context, docProps, helmetContext);
  }

  return {
    status: TEMPORARY_REDIRECT,
    data: { Location: `/${locale}${basepath}` },
  };
}
