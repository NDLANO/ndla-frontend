/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetch,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningPath = (id, locale) =>
  fetch(`${baseUrl}/${id}?locale=${locale}`).then(resolveJsonOrRejectWithError);

export const fetchLearningPathStep = (pathId, stepId, locale) =>
  fetch(`${baseUrl}/${pathId}/learningsteps/${stepId}?locale=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
