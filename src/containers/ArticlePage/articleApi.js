/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl } from '../../util/apiHelpers';

const converterBaseUrl = apiResourceUrl('/article-converter/raw');
const baseUrl = apiResourceUrl('/article-api/v1/articles');

export const fetchArticle = (id, locale) => fetch(`${converterBaseUrl}/${locale}/${id}`).then(resolveJsonOrRejectWithError);

export const fetchArticles = ids => fetch(`${baseUrl}?ids=${ids.join(',')}`).then(resolveJsonOrRejectWithError);
