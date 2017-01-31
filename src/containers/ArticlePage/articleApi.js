/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/article-converter/raw');

export const fetchArticle = (id, locale) => fetch(`${baseUrl}/${locale}/${id}`).then(resolveJsonOrRejectWithError);
