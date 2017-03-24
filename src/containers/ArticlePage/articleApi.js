/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl, headerWithAccessToken } from '../../util/apiHelpers';

const converterBaseUrl = apiResourceUrl('/article-converter/raw');
const baseUrl = apiResourceUrl('/article-api/v1/articles');

export const fetchArticle = (id, locale, token) => fetch(`${converterBaseUrl}/${locale}/${id}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchArticles = (ids, token) => fetch(`${baseUrl}?ids=${ids.join(',')}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);
