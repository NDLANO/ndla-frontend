/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchSubjects = () => fetch(`${baseUrl}/subjects/`).then(resolveJsonOrRejectWithError);

export const fetchTopics = subjectId => fetch(`${baseUrl}/subjects/${subjectId}/topics/?recursive=true`).then(resolveJsonOrRejectWithError);
