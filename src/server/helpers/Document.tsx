/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetServerState } from 'react-helmet-async';
import serialize from 'serialize-javascript';
import { Matomo } from './Matomo';
import Tagmanager from './Tagmanager';
import config, { ConfigType } from '../../config';

export interface Assets {
  css?: string;
  js: { src: string }[];
  mathJaxConfig?: { js: string };
}

export interface DocumentData {
  initialProps?: any;
  apolloState?: any;
  assets: Assets;
  config?: ConfigType;
}

interface Props {
  helmet: HelmetServerState;
  assets: Assets;
  data?: DocumentData;
  styles?: string;
}

const Document = ({ helmet, assets, data, styles }: Props) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...htmlAttrs}>
      <head>
        <Tagmanager />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 viewport-fit=cover"
        />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {assets.css && <link rel="stylesheet" href={assets.css} />}

        {config.ndlaEnvironment === 'test' ? (
          <>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/static/favicon-test-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/static/favicon-test-16x16.png"
            />
            <link
              rel="apple-touch-icon"
              type="image/png"
              sizes="180x180"
              href="/static/apple-touch-icon-test.png"
            />
          </>
        ) : config.ndlaEnvironment === 'staging' ? (
          <>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/static/favicon-staging-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/static/favicon-staging-16x16.png"
            />
            <link
              rel="apple-touch-icon"
              type="image/png"
              sizes="180x180"
              href="/static/apple-touch-icon-staging.png"
            />
          </>
        ) : (
          <>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/static/favicon-prod-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/static/favicon-prod-16x16.png"
            />
            <link
              rel="apple-touch-icon"
              type="image/png"
              sizes="180x180"
              href="/static/apple-touch-icon-prod.png"
            />
          </>
        )}
        {helmet.script.toComponent()}
        {styles && <div dangerouslySetInnerHTML={{ __html: styles }} />}
      </head>
      <body {...bodyAttrs}>
        <Matomo />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window._mtm = window._mtm || [];
            window.originalLocation = { originalLocation: document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search };
            window.dataLayer.push(window.originalLocation);`,
          }}
        />
        {config.monsidoToken.length ? (
          <>
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
    window._monsido = window._monsido || {
        token: "${config.monsidoToken}",
        statistics: {
            enabled: true,
            cookieLessTracking: true,
            documentTracking: {
                enabled: false,
                documentCls: "monsido_download",
                documentIgnoreCls: "monsido_ignore_download",
                documentExt: [],
            },
        },
    };
`,
              }}
            />
            <script
              type="text/javascript"
              async
              src="https://app-script.monsido.com/v2/monsido-script.js"
            ></script>
          </>
        ) : null}
        <div id="root">REPLACE_ME</div>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `window.DATA = ${serialize(data)}; `,
          }}
        />
        {assets.js.map((asset) => (
          <script
            key={asset.src}
            type="text/javascript"
            src={asset.src}
            defer
            crossOrigin="anonymous"
          />
        ))}
      </body>
    </html>
  );
};

export default Document;
