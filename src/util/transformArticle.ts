/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { transform, TransformOptions } from '@ndla/article-converter';
import { ReactNode } from 'react';
import { GQLArticle } from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import formatDate from './formatDate';

function getContent(
  content: string,
  { path, isOembed, subject, components, articleLanguage }: TransformOptions,
) {
  return transform(content, {
    frontendDomain: '',
    path,
    isOembed,
    subject,
    components,
    articleLanguage,
  });
}

export type BaseArticle = Pick<
  GQLArticle,
  | 'content'
  | 'introduction'
  | 'metaData'
  | 'created'
  | 'updated'
  | 'published'
  | 'requiredLibraries'
  | 'revisionDate'
>;

export type TransformedBaseArticle<T extends BaseArticle> = Omit<
  T,
  'content' | 'introduction'
> & {
  content: ReactNode;
  introduction: ReactNode;
};
export const transformArticle = <T extends BaseArticle>(
  article: T,
  locale: LocaleType,
  options?: TransformOptions,
): TransformedBaseArticle<T> => {
  const content = getContent(article.content, options ?? {});
  const footNotes = article?.metaData?.footnotes ?? [];
  return {
    ...article,
    content,
    introduction: transform(article.introduction ?? '', {}),
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
