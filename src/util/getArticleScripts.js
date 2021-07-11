/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function getArticleScripts(article) {
  const scripts =
    article?.requiredLibraries.map(lib => ({
      src: lib.url,
      type: lib.mediaType,
    })) || [];
  if (article && article.content.indexOf('<math') > -1) {
    scripts.push({
      src: '/static/mathjax-config.js',
      type: 'text/javascript',
      async: false,
      defer: true,
    });

    scripts.push({
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3.1.2/es5/mml-chtml.js',
      type: 'text/javascript',
      async: false,
      defer: true,
    });
  }

  return scripts;
}
