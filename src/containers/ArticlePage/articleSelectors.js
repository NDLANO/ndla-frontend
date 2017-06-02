/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { getLocale } from '../Locale/localeSelectors';
import { titleI18N, metaDescriptionI18N } from '../../util/i18nFieldFinder';
import formatDate from '../../util/formatDate';

const getArticleFromState = state => state.articles;

export const getArticleById = articleId =>
  createSelector([getArticleFromState], articles => articles[articleId]);

export const getArticle = articleId =>
  createSelector(
    [getArticleById(articleId), getLocale],
    (article, locale) =>
      article
        ? {
            ...article,
            title: titleI18N(article, locale, true),
            metaDescription: metaDescriptionI18N(article, locale, true),
            created: formatDate(article.created, locale),
            updated: formatDate(article.updated, locale),
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
          }
        : undefined,
  );
