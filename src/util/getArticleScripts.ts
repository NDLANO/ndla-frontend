/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLArticle } from '../graphqlTypes';

export interface Scripts {
  key?: string;
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

export function getArticleScripts(
  article: Pick<GQLArticle, 'requiredLibraries' | 'content'>,
  locale = 'nb',
) {
  const scripts: Array<Scripts> =
    article.requiredLibraries?.map(lib => ({
      src: lib.url,
      type: lib.mediaType,
    })) || [];
  if (article && article.content.indexOf('<math') > -1) {
    // Increment number for each change in config.
    scripts.push({
      src: `/static/mathjax-config.js?locale=${locale}&ts=${1}`,
      type: 'text/javascript',
      async: false,
      defer: true,
    });

    scripts.push({
      src:
        'https://cdn.jsdelivr.net/npm/mathjax@4.0.0-alpha.1/es5/mml-chtml.js',
      type: 'text/javascript',
      async: false,
      defer: true,
    });
  }

  return scripts;
}
