/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server.js';
import { Request } from 'express';
import { I18nextProvider } from 'react-i18next';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { i18nInstance } from '@ndla/ui';
import url from 'url';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { getCookie } from '@ndla/util';

import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
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
import { TaxonomyStructureProvider } from '../../components/TaxonomyStructureContext';
import IsMobileContext from '../../IsMobileContext';
import { TEMPORARY_REDIRECT } from '../../statusCodes';
import { Assets } from '../helpers/Document';
import { LocaleType } from '../../interfaces';

//@ts-ignore
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST); //eslint-disable-line

const getAssets = (): Assets => ({
  css: assets['client.css'],
  polyfill: { src: assets['polyfill.js'] },
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

const enableTaxStructure = (req: Request) => {
  const urlParts = url.parse(req.url, true);
  if (urlParts.query && urlParts.query.taxStructure) {
    return urlParts.query.taxStructure === 'true';
  }
  return config.taxonomyProgrammesEnabled;
};

async function doRender(req: Request) {
  //@ts-ignore
  global.assets = assets; // used for including mathjax js in pages with math
  const resCookie = req.headers['cookie'] ?? '';
  const userAgent = req.headers['user-agent'];
  const isMobile = userAgent
    ? getSelectorsByUserAgent(userAgent)?.isMobile
    : false;
  const versionHash =
    typeof req.query.versionHash === 'string'
      ? req.query.versionHash
      : undefined;
  const { basename, abbreviation } = getLocaleInfoFromPath(req.path);
  const locale = getCookieLocaleOrFallback(resCookie, abbreviation);
  const noSSR = disableSSR(req);
  const taxStructureValue = enableTaxStructure(req);

  const client = createApolloClient(locale, versionHash);

  const cache = createCache({ key: EmotionCacheKey });
  const context: RedirectInfo = {};

  const i18n = initializeI18n(i18nInstance, locale);

  // @ts-ignore
  const helmetContext: FilledContext = {};
  const Page = !noSSR ? (
    <RedirectContext.Provider value={context}>
      <TaxonomyStructureProvider value={taxStructureValue}>
        <HelmetProvider context={helmetContext}>
          <I18nextProvider i18n={i18n}>
            <ApolloProvider client={client}>
              <CacheProvider value={cache}>
                <VersionHashProvider value={versionHash}>
                  <IsMobileContext.Provider value={isMobile}>
                    <StaticRouter basename={basename} location={req.url}>
                      <App isClient={false} locale={locale} key={locale} />
                    </StaticRouter>
                  </IsMobileContext.Provider>
                </VersionHashProvider>
              </CacheProvider>
            </ApolloProvider>
          </I18nextProvider>
        </HelmetProvider>
      </TaxonomyStructureProvider>
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
