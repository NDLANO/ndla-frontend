/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../config';

const assets = __CLIENT__ // eslint-disable-line no-nested-ternary
  ? window.DATA.assets
  : config.isProduction
    ? require('../../assets/assets') // eslint-disable-line import/no-unresolved
    : require('../../server/developmentAssets');

export function getArticleScripts(article) {
  const scripts = article
    ? article.requiredLibraries.map(lib => ({
        src: lib.url,
        type: lib.mediaType,
      }))
    : [];

  if (article && article.content.indexOf('<math') > -1) {
    scripts.push({
      async: true,
      src: `https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=/assets/${
        assets['mathjaxConfig.js']
      }`,
      type: 'text/javascript',
    });
  }

  return scripts;
}
