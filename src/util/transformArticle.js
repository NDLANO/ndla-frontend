/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import formatDate from './formatDate';

export const transformArticle = (article, locale) => {
  if (!article) return undefined;
  const footNotes = defined(article.metaData.footnotes, []);
  return {
    ...article,
    created: formatDate(article.created, locale),
    updated: formatDate(article.updated, locale),
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
