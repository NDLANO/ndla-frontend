/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import Helmet from 'react-helmet';
import { renderToStaticMarkup } from 'react-dom/server';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status';

import { getHtmlLang, getLocaleObject } from '../../i18n';
import Document from '../helpers/Document';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { fetchResourceTypesForResource } from '../../containers/Resources/resourceApi';
import IframeArticlePage from '../../iframe/IframeArticlePage';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPage } from '../helpers/render';

const assets =
  process.env.NODE_ENV !== 'unittest'
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : { client: { css: 'mock.css' }, embed: { js: 'mock.js' } };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [assets.embed.js],
});

function doRenderPage(initialProps) {
  const Page = config.disableSSR ? '' : <IframeArticlePage {...initialProps} />;
  return renderPage(Page, getAssets(), {
    initialProps,
  });
}

export async function iframeArticleRoute(req) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  const { articleId, resourceId } = req.params;
  const userAgentString = req.headers['user-agent'];

  try {
    const article = await fetchArticle(articleId, lang);
    const resourceTypes = await fetchResourceTypesForResource(resourceId, lang);
    const { html, ...docProps } = doRenderPage({
      resource: { article, resourceTypes },
      locale,
      status: 'success',
    });

    const doc = renderToStaticMarkup(
      <Document userAgentString={userAgentString} {...docProps} />,
    );

    return {
      status: OK,
      data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, ...docProps } = doRenderPage({
      locale,
      status: 'error',
    });

    const doc = renderToStaticMarkup(
      <Document userAgentString={userAgentString} {...docProps} />,
    );
    return {
      status: error.status || INTERNAL_SERVER_ERROR,
      data: `<!doctype html>${doc.replace('REPLACE_ME', html)}`,
    };
  }
}
