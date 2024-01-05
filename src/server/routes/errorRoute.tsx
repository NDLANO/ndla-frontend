/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { MissingRouterContext } from '@ndla/safelink';
import { i18nInstance } from '@ndla/ui';
import { RedirectInfo } from '../../components/RedirectContext';
import ErrorPage from '../../containers/ErrorPage';
import { INTERNAL_SERVER_ERROR } from '../../statusCodes';
import { Assets } from '../helpers/Document';
import { renderHtml, renderPage } from '../helpers/render';

//@ts-ignore
const assets = require(process.env.ASSETS_MANIFEST);

const getAssets = (): Assets => ({
  css: assets['client.css'],
  // Error page is a static page, only use js to inject css under development
  js: assets['injectCss.js'] ? [{ src: assets['injectCss.js'] }] : [],
});

async function doRenderError(status = INTERNAL_SERVER_ERROR) {
  const context: RedirectInfo = { status };
  //@ts-ignore
  const helmetContext: FilledContext = {};
  const Page = (
    <I18nextProvider i18n={i18nInstance}>
      <MissingRouterContext.Provider value={true}>
        <HelmetProvider context={helmetContext}>
          <ErrorPage />
        </HelmetProvider>
      </MissingRouterContext.Provider>
    </I18nextProvider>
  );

  const { html, ...docProps } = renderPage(Page, getAssets());

  return {
    html,
    docProps,
    context,
    helmetContext,
  };
}

export async function errorRoute() {
  const { html, context, docProps, helmetContext } = await doRenderError();
  return renderHtml(html, context, docProps, helmetContext);
}
