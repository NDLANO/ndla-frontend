/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { resetIdCounter } from '@ndla/tabs';
import { OK, MOVED_PERMANENTLY } from 'http-status';
import { Helmet } from 'react-helmet';
import createEmotionServer from 'create-emotion-server';

import Document from './Document';
import config from '../../config';

export function renderPage(Page, assets, data = {}, cache) {
  resetIdCounter();
  if (cache) {
    const { extractCritical } = createEmotionServer(cache);
    const { html, css, ids } = extractCritical(renderToString(Page));
    const helmet = Helmet.renderStatic();
    return {
      html,
      helmet,
      assets,
      css,
      ids,
      // Following is serialized to window.DATA
      data: {
        ...data,
        config,
        assets,
      },
    };
  }
  const html = renderToString(Page);
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets,
    // Following is serialized to window.DATA
    data: {
      ...data,
      config,
      assets,
    },
  };
}

export async function renderPageWithData(
  Page,
  assets,
  data = {},
  cache,
  client,
) {
  resetIdCounter();
  if (cache) {
    const { extractCritical } = createEmotionServer(cache);
    const { html, css, ids } = extractCritical(
      await renderToStringWithData(Page),
    );

    const apolloState = client?.extract();
    const helmet = Helmet.renderStatic();
    return {
      html,
      helmet,
      assets,
      css,
      ids,
      // Following is serialized to window.DATA
      data: {
        ...data,
        apolloState,
        config,
        assets,
      },
    };
  }
  const html = await renderToStringWithData(Page);
  const apolloState = client?.extract();
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets,
    // Following is serialized to window.DATA
    data: {
      ...data,
      apolloState,
      config,
      assets,
    },
  };
}

export async function renderHtml(req, html, context, props) {
  const doc = renderToStaticMarkup(<Document {...props} />);

  if (context.url) {
    return {
      status: context.status || MOVED_PERMANENTLY,
      data: {
        Location: context.url,
      },
    };
  }

  const status = context.status ?? OK;

  return {
    status,
    data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
  };
}
