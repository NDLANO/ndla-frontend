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
  if (
    article &&
    article.content.indexOf('<math') > -1 &&
    process.env.BUILD_TARGET === 'client'
  ) {
    // Increment number for each change in config.
    scripts.push({
      src: `/static/mathjax-config.js?locale=${locale}&ts=${2}`,
      type: 'text/javascript',
      async: false,
      defer: true,
    });

    scripts.push({
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/mml-chtml.js',
      type: 'text/javascript',
      async: false,
      defer: true,
    });
  }

  if (article && article.content.indexOf('data-resource="h5p"') > -1) {
    scripts.push({
      src: 'https://ca.h5p.ndla.no/h5p-php-library/js/h5p-resizer.js',
      type: 'text/javascript',
      async: false,
      defer: true,
    });
  }

  return scripts;
}
