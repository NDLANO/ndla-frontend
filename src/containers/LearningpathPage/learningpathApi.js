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
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/learningpath-api/v2/learningpaths');

export const fetchLearningpath = async (id, locale) => {
  const response = await fetch(
    `${baseUrl}/${id}?language=${locale}&fallback=true`,
  );
  const learningpath = await resolveJsonOrRejectWithError(response);
  return {
    ...learningpath,
    title: learningpath.title.title,
    description: learningpath.description
      ? learningpath.description.description
      : undefined,
    lastUpdated: learningpath.lastUpdated,
    coverphoto: {
      url: learningpath.coverPhotoUrl,
      alt: learningpath.introduction
        ? learningpath.introduction.introduction
        : '',
    },
    tags: learningpath.tags ? learningpath.tags.tags : [],
  };
};

export const fetchLearningpathStep = async (id, stepId, locale) => {
  const response = await fetch(
    `${baseUrl}/${id}/learningsteps/${stepId}?language=${locale}&fallback=true`,
  );
  const learningpathStep = await resolveJsonOrRejectWithError(response);
  return {
    ...learningpathStep,
    title: learningpathStep.title ? learningpathStep.title.title : '',
    description: learningpathStep.description
      ? learningpathStep.description.description
      : undefined,
  };
};
