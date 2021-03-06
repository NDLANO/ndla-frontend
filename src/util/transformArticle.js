/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import formatDate from './formatDate';

function getContent(article) {
  /**
   * We call extractCSS on the whole page server side. This removes/hoists
   * all style tags. The data (article) object is serialized with the style
   * tags included so we need to remove them so that we don't have a mismatch
   * between server and client.
   *
   * N.B. We only want to remove the styles in the first render (i.e hydrate
   * phase). The styles needs to be applied on subsequent renders else new
   * styles will not be included.
   */
  if (process.env.BUILD_TARGET === 'client' && !window.hasHydrated) {
    return article.content.replace(/<style.+?>.+?<\/style>/g, '');
  }
  return article.content;
}

export const transformArticle = (article, locale) => {
  if (!article) return undefined;

  const content = getContent(article);
  const footNotes = defined(article.metaData.footnotes, []);
  return {
    ...article,
    content,
    created: formatDate(article.created, locale),
    updated: formatDate(article.updated, locale),
    published: formatDate(article.published, locale),
    footNotes,
    requiredLibraries: article.requiredLibraries
      ? article.requiredLibraries.map(lib => {
          if (lib.url.startsWith('http://')) {
            return {
              ...lib,
              url: lib.url.replace('http://', 'https://'),
            };
          }
          return lib;
        })
      : [],
  };
};
