/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLArticle } from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import formatDate from './formatDate';

function getContent(content: string) {
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
    return content.replace(/<style.+?>.+?<\/style>/g, '');
  }
  return content;
}

type BaseArticle = Pick<
  GQLArticle,
  | 'content'
  | 'metaData'
  | 'created'
  | 'updated'
  | 'published'
  | 'requiredLibraries'
  | 'revisionDate'
>;
export const transformArticle = <T extends BaseArticle>(
  article: T,
  locale: LocaleType,
): T => {
  const content = getContent(article.content);
  const footNotes = article?.metaData?.footnotes ?? [];
  return {
    ...article,
    content,
    created: formatDate(article.created, locale),
    updated: formatDate(article.updated, locale),
    published: formatDate(article.published, locale),
    footNotes,
    requiredLibraries: article.requiredLibraries
      ? article.requiredLibraries.map(lib => {
          if (lib?.url.startsWith('http://')) {
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
