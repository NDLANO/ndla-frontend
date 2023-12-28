/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import url from 'url';
import { Request } from 'express';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { StaticRouter } from 'react-router-dom/server.js';
import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { i18nInstance } from '@ndla/ui';
import RedirectContext, {
  RedirectInfo,
} from '../../components/RedirectContext';
import config from '../../config';
import { EmotionCacheKey } from '../../constants';
import { getHtmlLang, initializeI18n, isValidLocale } from '../../i18n';
import EmbedIframePageContainer from '../../iframe/EmbedIframePageContainer';
import { LocaleType, LtiData } from '../../interfaces';
import { INTERNAL_SERVER_ERROR, OK } from '../../statusCodes';
import { createApolloClient } from '../../util/apiHelpers';
import handleError from '../../util/handleError';
import { renderPageWithData, renderHtml } from '../helpers/render';

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

const MOCK_ASSETS = {
  'client.css': 'mock.css',
  'embedIframe.js': 'mock.js',
  'mathJaxConfig.js': 'mock.js',
};

const assets =
  process.env.NODE_ENV !== 'unittest' && process.env.ASSETS_MANIFEST
    ? require(process.env.ASSETS_MANIFEST) //eslint-disable-line
    : MOCK_ASSETS;

if (process.env.NODE_ENV === 'unittest') {
  HelmetProvider.canUseDOM = false;
}

const getAssets = () => ({
  css: assets['client.css'],
  js: [{ src: assets['embedIframe.js'] }],
  mathJaxConfig: { js: assets['mathJaxConfig.js'] },
});

const disableSSR = (req: Request) => {
  const urlParts = url.parse(req.url, true);
  if (urlParts.query && urlParts.query.disableSSR) {
    return urlParts.query.disableSSR === 'true';
  }
  return config.disableSSR;
};

async function doRenderPage(req: Request, initialProps: EmbedInitialProps) {
  const context: RedirectInfo = {};

  const client = createApolloClient(initialProps.locale);

  //@ts-ignore
  const helmetContext: FilledContext = {};
  const cache = createCache({ key: EmotionCacheKey });
  const noSSR = disableSSR(req);

  const i18n = initializeI18n(
    i18nInstance,
    initialProps.locale ?? config.defaultLocale,
  );
  const Page = (
    <HelmetProvider context={helmetContext}>
      {noSSR ? (
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
    disableSSR: noSSR,
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
