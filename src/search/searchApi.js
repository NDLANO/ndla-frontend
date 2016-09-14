/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl } from '../util/apiHelpers';

const baseUrl = apiResourceUrl('/articles');

export const search = (query, page, locale, sortOrder) => fetch(`${baseUrl}/?query=${query}&page=${page}&language=${locale}&sort=${sortOrder}`).then(resolveJsonOrRejectWithError);
