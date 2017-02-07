/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


//

 import httpStaus from 'http-status';

 const assets = process.env.NODE_ENV === 'development' ? require('./developmentAssets') : require('../htdocs/assets/assets'); // eslint-disable-line import/no-unresolved

 export const htmlTemplate = (lang, body, introduction, title) =>
  `<!doctype html>\n<html lang=${lang} >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="stylesheet" type="text/css" href=/assets/${assets['main.css']} />
    </head>
    <body>
      <h1>${title}</h1>
      <section>
        ${introduction}
      </section>
      ${body}
      <script type="text/javascript" src=/assets/${assets['embed.js']}></script>
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
