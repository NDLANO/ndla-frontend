/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import url from 'url';
import { Request } from 'express';
import { i18nInstance } from '@ndla/ui';
import { I18nextProvider } from 'react-i18next';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server.js';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { INTERNAL_SERVER_ERROR, OK } from '../../statusCodes';
import { getHtmlLang, initializeI18n, isValidLocale } from '../../i18n';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPageWithData, renderHtml } from '../helpers/render';
import { EmotionCacheKey } from '../../constants';
import { createApolloClient } from '../../util/apiHelpers';
import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
import { LocaleType, LtiData } from '../../interfaces';
import EmbedIframePageContainer from '../../iframe/EmbedIframePageContainer';

export type EmbedInitialProps = {
  embedId?: string;
  embedType?: string;
  isOembed?: string;
  status?: 'success' | 'error';
  loading?: boolean;
  resCookie?: string;
  basename?: string;
  locale?: LocaleType;
  ltiData?: LtiData;
};

const assets =
  process.env.NODE_ENV !== 'unittest' && process.env.RAZZLE_ASSETS_MANIFEST
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        'client.css': 'mock.css',
        'embed.js': 'mock.js',
        'polyfill.js': 'mock.js',
        'mathJaxConfig.js': 'mock.js',
      };

if (process.env.NODE_ENV === 'unittest') {
  HelmetProvider.canUseDOM = false;
}

const getAssets = () => ({
  css: assets['client.css'],
  js: [{ src: assets['embedIframe.js'] }],
  polyfill: { src: assets['polyfill.js'] },
  mathJaxConfig: { js: assets['mathJaxConfig.js'] },
});

const disableSSR = (req: Request) => {
  const urlParts = url.parse(req.url, true);
  if (config.disableSSR) {
    return true;
  }
  return urlParts.query && urlParts.query.disableSSR === 'true';
};

async function doRenderPage(req: Request, initialProps: EmbedInitialProps) {
  const context: RedirectInfo = {};

  const client = createApolloClient(initialProps.locale);

  //@ts-ignore
  const helmetContext: FilledContext = {};
  const cache = createCache({ key: EmotionCacheKey });

  const i18n = initializeI18n(
    i18nInstance,
    initialProps.locale ?? config.defaultLocale,
  );
  const Page = (
    <HelmetProvider context={helmetContext}>
      {disableSSR(req) ? (
        ''
      ) : (
        <I18nextProvider i18n={i18n}>
          <RedirectContext.Provider value={context}>
            <ApolloProvider client={client}>
              <CacheProvider value={cache}>
                <StaticRouter location={req.url}>
                  <EmbedIframePageContainer {...initialProps} />
                </StaticRouter>
              </CacheProvider>
            </ApolloProvider>
          </RedirectContext.Provider>
        </I18nextProvider>
      )}
    </HelmetProvider>
  );
  const assets = getAssets();
  const { html, ...docProps } = await renderPageWithData({
    Page,
    assets,
    data: { initialProps },
    client,
  });
  return { html, docProps, helmetContext, redirectContext: context };
}

export async function iframeEmbedRoute(req: Request) {
  const lang = req.params.lang ?? '';
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { embedType, embedId } = req.params;
  try {
    const { html, docProps, helmetContext, redirectContext } =
      await doRenderPage(req, {
        isOembed: 'true',
        basename: lang,
        locale,
        embedType,
        embedId,
        status: 'success',
      });

    return renderHtml(
      html,
      { status: redirectContext.status ?? OK },
      docProps,
      helmetContext,
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps, helmetContext } = await doRenderPage(req, {
      basename: lang,
      locale,
      status: 'error',
    });

    const typedError = error as { status?: number };
    const status = typedError.status || INTERNAL_SERVER_ERROR;

    return renderHtml(html, { status }, docProps, helmetContext);
  }
}
