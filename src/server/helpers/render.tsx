/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import { FilledContext } from 'react-helmet-async';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { EmotionCache } from '@emotion/cache';
import { ApolloClient } from '@apollo/client';
import { resetIdCounter } from '@ndla/tabs';
import createEmotionServer from '@emotion/server/create-instance';
import { OK, MOVED_PERMANENTLY } from '../../statusCodes';

import Document, { Assets, DocumentData } from './Document';
import config from '../../config';
import { RedirectInfo } from '../../components/RedirectContext';

export function renderPage<T extends object>(
  Page: ReactElement,
  assets: Assets,
  data?: T,
) {
  resetIdCounter();
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

interface Props<T extends object> {
  Page: ReactElement;
  assets: Assets;
  data?: T;
  cache?: EmotionCache;
  client: ApolloClient<any>;
}

export async function renderPageWithData<T extends object>({
  Page,
  assets,
  data,
  cache,
  client,
}: Props<T>) {
  resetIdCounter();
  if (cache) {
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      createEmotionServer(cache);
    const html = await renderToStringWithData(Page);
    const chunks = extractCriticalToChunks(html);
    const styles = constructStyleTagsFromChunks(chunks);
    const apolloState = client?.extract();
    return {
      html,
      assets,
      styles,
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

export async function renderHtml(
  html: string,
  context: RedirectInfo,
  props: DocumentData,
  helmetContext: FilledContext,
) {
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
