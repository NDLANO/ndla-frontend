/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function getAssets() {
  if (process.env.BUILD_TARGET === 'client') {
    return window.DATA.assets;
  }
  return global.assets;
}

export function getArticleScripts(article) {
  const assets = getAssets();
  const scripts = article
    ? article.requiredLibraries.map(lib => ({
        src: lib.url,
        type: lib.mediaType,
      }))
    : [];

  if (article && article.content.indexOf('<math') > -1) {
    scripts.push({
      async: true,
      src: `https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=${
        assets.mathJaxConfig.js
      }`,
      type: 'text/javascript',
    });
  }

  return scripts;
}
