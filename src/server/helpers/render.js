/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import defined from 'defined';
import { resetIdCounter } from 'ndla-tabs';
import { OK, MOVED_PERMANENTLY } from 'http-status';
import Helmet from 'react-helmet';
import getConditionalClassnames from './getConditionalClassnames';
import Document from './Document';
import config from '../../config';

export function renderPage(Page, assets, data = {}) {
  resetIdCounter();
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
      accessToken: global.access_token,
    },
  };
}

export async function renderHtml(req, html, context, props) {
  const userAgentString = req.headers['user-agent'];
  const className = getConditionalClassnames(userAgentString);

  const doc = renderToStaticMarkup(
    <Document
      className={className}
      userAgentString={userAgentString}
      useZendesk
      {...props}
    />,
  );

  if (context.url) {
    return {
      status: MOVED_PERMANENTLY,
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
