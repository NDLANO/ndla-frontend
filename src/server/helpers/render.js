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
import defined from 'defined';
import { resetIdCounter } from '@ndla/tabs';
import { OK, MOVED_PERMANENTLY } from 'http-status';
import { Helmet } from 'react-helmet';

import { ChunkExtractor } from '@loadable/server';
import Document from './Document';
import config from '../../config';
const path = require('path');

export function renderPage(Page, assets, data = {}) {
  resetIdCounter();
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  });
  const jsx = extractor.collectChunks(Page);
  const html = renderToString(jsx);
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    assets,
    extractor,
    // Following is serialized to window.DATA
    data: {
      ...data,
      config,
      assets,
    },
  };
}

export async function renderPageWithData(Page, assets, data, client) {
  await renderToStringWithData(Page); // Fetches queries, so state can be extracted from client
  const apolloState = client.extract();
  return renderPage(Page, assets, { apolloState, ...data });
}

export async function renderHtml(html, context, props) {
  const doc = renderToStaticMarkup(<Document {...props} />);

  if (context.url) {
    return {
      status: context.status || MOVED_PERMANENTLY,
      data: {
        Location: context.url,
      },
    };
  }

  const status = defined(context.status, OK);

  return {
    status,
    data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
  };
}
