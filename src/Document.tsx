/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import type { ManifestChunk } from "vite";
import Scripts from "./components/Scripts/Scripts";
import config from "./config";

interface Props {
  language: string;
  children?: ReactNode;
  chunks?: ManifestChunk[];
  devEntrypoint: string;
}

const getUniqueCss = (chunks: ManifestChunk[]) => {
  const uniq = chunks.reduce((acc, curr) => {
    curr.css?.forEach((css) => acc.add(css));
    return acc;
  }, new Set<string>());
  return Array.from(uniq);
};

export const Document = ({ language, children, chunks = [], devEntrypoint }: Props) => {
  const faviconEnvironment = config.ndlaEnvironment === "dev" ? "test" : config.ndlaEnvironment;
  const locale = language === "nb" || language === "nn" ? "no" : language;

  const [entryPoint, ...importedChunks] = chunks;
  const css = getUniqueCss(chunks);

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={`/static/favicon-${faviconEnvironment}-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/static/favicon-${faviconEnvironment}-16x16.png`} />
        <link
          rel="preload"
          href={`/locales/${language}/translation.json`}
          as="fetch"
          type="application/json"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href={`/static/apple-touch-icon-${faviconEnvironment}.png`}
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1 viewport-fit=cover" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      window._mtm = window._mtm || [];
      window.originalLocation = {
        originalLocation:
          document.location.protocol +
          "//" +
          document.location.hostname +
          document.location.pathname +
          document.location.search,
      };
      window.dataLayer.push(window.originalLocation);
`,
          }}
        ></script>
        {config.runtimeType === "development" && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                import RefreshRuntime from "/@react-refresh";
                RefreshRuntime.injectIntoGlobalHook(window);
                window.$RefreshReg$ = () => {};
                window.$RefreshSig$ = () => (type) => type;
                window.__vite_plugin_react_preamble_installed__ = true;
              `,
              }}
              type="module"
            />
            <script src="/@vite/client" type="module" />
            <script type="module" src={`/${devEntrypoint}`}></script>
          </>
        )}
        <script
          // We're hydrating the entire document. Our config differentiates between server and client, so it's necessary to suppress any hydration warnings here. TODO: Find a better workaround for this
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: config.isClient ? "" : `window.DATA = "$WINDOW_DATA"`,
          }}
        ></script>
        <Scripts />
        {!!entryPoint && <script type="module" src={`/${entryPoint.file}`}></script>}
        {css.map((file) => (
          <link rel="stylesheet" href={`/${file}`} key={file} />
        ))}
        {importedChunks.map((chunk) => (
          <link rel="modulepreload" href={`/${chunk.file}`} key={chunk.file}></link>
        ))}
        <div id="root">{children}</div>
      </body>
    </html>
  );
};
