/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetServerState } from 'react-helmet-async';
import serialize from 'serialize-javascript';
import ScriptLoader from '@ndla/polyfill/lib/ScriptLoader';
import { GoogleTagMangerScript, GoogleTagMangerNoScript } from './Gtm';
import { Matomo } from './Matomo';
import config, { ConfigType } from '../../config';
import { EmotionCacheKey } from '../../constants';

interface Assets {
  css?: string;
  js: { src: string }[];
  mathJaxConfig: { js: string };
  polyfill: { src: string };
}

interface DocumentData {
  initialProps?: any;
  apolloState?: any;
  assets: Assets;
  config: ConfigType;
}

interface Props {
  helmet: HelmetServerState;
  assets: Assets;
  data?: DocumentData;
  css?: string;
  ids?: string[];
}

const Document = ({ helmet, assets, data, css, ids }: Props) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    <html {...htmlAttrs}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 viewport-fit=cover"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,700|Source+Serif+Pro:400,700|Source+Code+Pro:400,700"
        />
        {config.gaTrackingId && (
          <script async src="https://www.google-analytics.com/analytics.js" />
        )}
        <GoogleTagMangerScript />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {assets.css && <link rel="stylesheet" href={assets.css} />}
        <link
          rel="shortcut icon"
          href="/static/ndla-favicon.png"
          type="image/x-icon"
        />
        {css && ids && (
          <style data-emotion-css={`${EmotionCacheKey} ${ids.join(' ')}`}>
            ${css}
          </style>
        )}
        {helmet.script.toComponent()}
      </head>
      <body {...bodyAttrs}>
        <GoogleTagMangerNoScript />
        <Matomo />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window.originalLocation = { originalLocation: document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search };
            window.dataLayer.push(window.originalLocation);`,
          }}
        />
        <div id="root">REPLACE_ME</div>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `window.DATA = ${serialize(data)}; `,
          }}
        />
        <ScriptLoader polyfill={assets.polyfill} scripts={assets.js} />
      </body>
    </html>
  );
};

export default Document;
