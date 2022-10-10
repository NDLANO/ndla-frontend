/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { resetIdCounter } from '@ndla/tabs';
import createEmotionServer from '@emotion/server/create-instance';
import { OK, MOVED_PERMANENTLY } from '../../statusCodes';

import Document from './Document';
import config from '../../config';

export function renderPage(Page, assets, data = {}, cache) {
  resetIdCounter();
  if (cache) {
    const { extractCritical } = createEmotionServer(cache);
    const { html, css, ids } = extractCritical(renderToString(Page));
    return {
      html,
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
  return {
    html,
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
    return {
      html,
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
  return {
    html,
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

export async function renderHtml(req, html, context, props, helmetContext) {
  const doc = renderToStaticMarkup(
    <Document {...props} helmet={helmetContext.helmet} />,
  );

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
