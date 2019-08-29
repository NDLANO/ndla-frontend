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
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { getHtmlLang, getLocaleObject } from '../../i18n';
import { fetchResourceTypesForResource } from '../../containers/Resources/resourceApi';
import IframeArticlePage from '../../iframe/IframeArticlePage';
import config from '../../config';
import handleError from '../../util/handleError';
import { renderPage, renderHtml } from '../helpers/render';
import {
  fetchLearningpath,
  fetchLearningpathStep,
} from '../../containers/LearningpathPage/learningpathApi';

const assets =
  process.env.NODE_ENV !== 'unittest'
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        client: { css: 'mock.css' },
        embed: { js: 'mock.js' },
        polyfill: { js: 'mock.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [{ src: assets.embed.js }],
  polyfill: { src: assets.polyfill.js },
  mathJaxConfig: { js: assets.mathJaxConfig.js },
});

function doRenderPage(initialProps) {
  const Page = config.disableSSR ? '' : <IframeArticlePage {...initialProps} />;
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps };
}

export async function iframeLearningpathRoute(req) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);
  const { learningpathId, resourceId } = req.params;
  const location = { pathname: req.url };
  try {
    const learningpath = await fetchLearningpath(learningpathId, lang);
    const learningsteps = await Promise.all(
      learningpath.learningsteps.map(step =>
        fetchLearningpathStep(learningpathId, step.id, lang),
      ),
    );

    const resourceTypes = await fetchResourceTypesForResource(resourceId, lang);
    const { html, docProps } = doRenderPage({
      resource: {
        learningpath: { ...learningpath, learningsteps },
        resourceTypes,
      },
      locale,
      status: 'success',
      location,
    });

    return renderHtml(req, html, { status: OK }, docProps);
  } catch (error) {
    if (process.env.NODE_ENV !== 'unittest') {
      // skip log in unittests
      handleError(error);
    }
    const { html, docProps } = doRenderPage({
      locale,
      location,
      status: 'error',
    });

    const status = error.status || INTERNAL_SERVER_ERROR;
    return renderHtml(req, html, { status }, docProps);
  }
}
