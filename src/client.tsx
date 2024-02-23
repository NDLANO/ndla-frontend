/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./style/index.css";
//@ts-ignore
import queryString from "query-string";
import { ReactNode } from "react";
import { useDeviceSelectors } from "react-device-detect";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "@fontsource/source-code-pro/400-italic.css";
import "@fontsource/source-code-pro/700.css";
import "@fontsource/source-code-pro/index.css";
import "@fontsource/source-sans-pro/300-italic.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/400-italic.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-sans-pro/index.css";
import "@fontsource/source-serif-pro/400-italic.css";
import "@fontsource/source-serif-pro/700.css";
import "@fontsource/source-serif-pro/index.css";
// @ts-ignore
import ErrorReporter from "@ndla/error-reporter";
import { i18nInstance } from "@ndla/ui";
import App from "./App";
import { VersionHashProvider } from "./components/VersionHashContext";
import { EmotionCacheKey } from "./constants";
import { getLocaleInfoFromPath, initializeI18n, isValidLocale } from "./i18n";
import { NDLAWindow } from "./interfaces";
import { UserAgentProvider } from "./UserAgentContext";
import { createApolloClient } from "./util/apiHelpers";

declare global {
  interface Window extends NDLAWindow {}
}

const {
  DATA: { config, serverPath, serverQuery },
} = window;

const { basepath } = getLocaleInfoFromPath(serverPath ?? "");

const paths = window.location.pathname.split("/");
const lang = isValidLocale(paths[1] ?? "") ? `${paths[1]}` : undefined;

const { versionHash } = queryString.parse(window.location.search);

const serverQueryString = decodeURIComponent(queryString.stringify(serverQuery));
const locationFromServer = {
  pathname: basepath || "/",
  search: serverQueryString ? `?${serverQueryString}` : "",
};

const i18n = initializeI18n(i18nInstance, lang ?? config.defaultLocale);

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey: config.logglyApiKey,
  environment: config.ndlaEnvironment,
  componentName: config.componentName,
  ignoreUrls: [],
});

const client = createApolloClient(lang, versionHash);
const cache = createCache({ key: EmotionCacheKey });

// Use memory router if running under google translate
const testLocation = locationFromServer?.pathname + locationFromServer?.search;
const isGoogleUrl = decodeURIComponent(window.location.search).indexOf(testLocation) > -1;

interface RCProps {
  children: ReactNode;
  base: string;
}

const RouterComponent = ({ children, base }: RCProps) =>
  isGoogleUrl ? (
    <MemoryRouter initialEntries={[locationFromServer]}>{children}</MemoryRouter>
  ) : (
    <BrowserRouter basename={base}>{children}</BrowserRouter>
  );

const UserAgentWrapper = ({ basename }: { basename?: string }) => {
  const [selectors] = useDeviceSelectors(window.navigator.userAgent);

  return (
    <UserAgentProvider value={selectors}>
      <RouterComponent base={basename ?? ""}>
        <App base={basename} />
      </RouterComponent>
    </UserAgentProvider>
  );
};

const renderOrHydrate = (container: HTMLElement, children: ReactNode) => {
  if (config.disableSSR) {
    const root = createRoot(container);
    root.render(children);
  } else {
    hydrateRoot(container, children);
  }
};

renderOrHydrate(
  document.getElementById("root")!,
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={client}>
        <CacheProvider value={cache}>
          <VersionHashProvider value={versionHash}>
            <UserAgentWrapper basename={lang} />
          </VersionHashProvider>
        </CacheProvider>
      </ApolloProvider>
    </I18nextProvider>
  </HelmetProvider>,
);

if (module.hot) {
  module.hot.accept();
}
