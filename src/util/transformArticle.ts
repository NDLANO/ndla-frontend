/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { transform, TransformOptions } from '@ndla/article-converter';
import { GQLArticle } from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import formatDate from './formatDate';

function getContent(
  content: string,
  { path, isOembed, subject, components }: TransformOptions,
) {
  return transform(content, {
    frontendDomain: '',
    path,
    isOembed,
    subject,
    components,
  });
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
  | 'title'
>;
export const transformArticle = <T extends BaseArticle>(
  article: T,
  locale: LocaleType,
  options?: TransformOptions,
): T => {
  const content = getContent(article.content.content, options ?? {});
  const footNotes = article?.metaData?.footnotes ?? [];
  return {
    ...article,
    content,
    created: formatDate(article.created, locale),
    updated: formatDate(article.updated, locale),
    published: formatDate(article.published, locale),
    footNotes,
    requiredLibraries: article.requiredLibraries
      ? article.requiredLibraries.map((lib) => {
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
