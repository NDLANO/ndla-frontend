/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import httpStaus from 'http-status';
import config from '../src/config';

const assets = config.isProduction ? require('../htdocs/assets/assets') : require('./developmentAssets'); // eslint-disable-line import/no-unresolved

const styleLink = config.isProduction ? `<link rel="stylesheet" type="text/css" href=/assets/${assets['main.css']} />` : '';

export const htmlTemplate = (lang, body, introduction, title) =>
  `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="shortcut icon" href="/assets/${assets['ndla-favicon.png']}"" type="image/x-icon" />
      ${styleLink}
    </head>
    <body>
      <h1>${title}</h1>
      <section>
        ${introduction}
      </section>
      ${body}
      <script type="text/javascript" src="/assets/${assets['embed.js']}"></script>
    </body>
  </html>`;

export const htmlErrorTemplate = (lang, { status, message, description, stacktrace }) => {
  const statusMsg = httpStaus[status];
  return htmlTemplate(lang, `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
};
