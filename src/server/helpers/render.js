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
import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Document from '../helpers/Document';
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

export async function renderHtml(req, rendered) {
  const userAgentString = req.headers['user-agent'];
  const className = getConditionalClassnames(userAgentString);

  const doc = renderToStaticMarkup(
    <Document
      className={className}
      userAgentString={userAgentString}
      {...rendered.docProps}
      useZendesk
    />,
  );

  if (rendered.context.url) {
    return {
      status: MOVED_PERMANENTLY,
      data: {
        Location: rendered.context.url,
      },
    };
  }

  const status = defined(rendered.context.status, OK);

  return {
    status,
    data: `<!doctype html>${doc.replace('REPLACE_ME', rendered.html)}`,
  };
}
