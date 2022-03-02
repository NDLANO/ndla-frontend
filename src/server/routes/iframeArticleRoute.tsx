/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import url from 'url';
import { Request } from 'express';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import { INTERNAL_SERVER_ERROR, OK } from '../../statusCodes';
import { getHtmlLang, isValidLocale } from '../../i18n';
import IframePageContainer from '../../iframe/IframePageContainer';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPageWithData, renderHtml } from '../helpers/render';
import { EmotionCacheKey } from '../../constants';
import { InitialProps } from '../../interfaces';
import { createApolloClient } from '../../util/apiHelpers';

const assets =
  process.env.NODE_ENV !== 'unittest' && process.env.RAZZLE_ASSETS_MANIFEST
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        client: { css: 'mock.css' },
        embed: { js: 'mock.js' },
        polyfill: { js: 'mock.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [{ src: assets.embed.js }],
  polyfill: { src: assets.polyfill.js },
  mathJaxConfig: { js: assets.mathJaxConfig.js },
});

const disableSSR = (req: Request) => {
  const urlParts = url.parse(req.url, true);
  if (config.disableSSR) {
    return true;
  }
  return urlParts.query && urlParts.query.disableSSR === 'true';
};

async function doRenderPage(req: Request, initialProps: InitialProps) {
  const context = {};

  const client = createApolloClient(
    initialProps.locale,
    initialProps.resCookie,
  );

  const cache = createCache({ key: EmotionCacheKey });
  const Page = disableSSR(req) ? (
    ''
  ) : (
    <ApolloProvider client={client}>
      <CacheProvider value={cache}>
        <StaticRouter
          basename={initialProps.basename}
          location={req.url}
          context={context}>
          <IframePageContainer {...initialProps} />
        </StaticRouter>
      </CacheProvider>
    </ApolloProvider>
  );
  const assets = getAssets();
  const { html, ...docProps } = await renderPageWithData(
    Page,
    assets,
    {
      initialProps,
    },
    undefined,
    client,
  );
  return { html, docProps };
}

export async function iframeArticleRoute(req: Request) {
  const lang = req.params.lang ?? '';
  const htmlLang = getHtmlLang(lang);
  const locale = isValidLocale(htmlLang) ? htmlLang : undefined;
  const { articleId, taxonomyId } = req.params;
  try {
    const { html, docProps } = await doRenderPage(req, {
      articleId,
      taxonomyId,
      isOembed: 'true',
      isTopicArticle: taxonomyId?.startsWith('urn:topic') || false,
      basename: lang,
      locale,
      status: 'success',
    });

    return renderHtml(req, html, { status: OK }, docProps);
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps } = await doRenderPage(req, {
      basename: lang,
      locale,
      status: 'error',
    });

    const status = error.status || INTERNAL_SERVER_ERROR;
    return renderHtml(req, html, { status }, docProps);
  }
}
