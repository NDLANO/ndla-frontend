/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';
import { GQLResource, GQLResourceType, GQLTopic } from '../graphqlTypes';

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../constants';

const { contentTypes } = constants;

type ContentType =
  | typeof RESOURCE_TYPE_SOURCE_MATERIAL
  | typeof RESOURCE_TYPE_LEARNING_PATH
  | typeof RESOURCE_TYPE_TASKS_AND_ACTIVITIES
  | typeof RESOURCE_TYPE_SUBJECT_MATERIAL
  | typeof RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES
  | typeof RESOURCE_TYPE_SOURCE_MATERIAL
  | string;

export const contentTypeMapping: Record<ContentType, string> = {
  [RESOURCE_TYPE_LEARNING_PATH]: contentTypes.LEARNING_PATH,

  [RESOURCE_TYPE_SUBJECT_MATERIAL]: contentTypes.SUBJECT_MATERIAL,

  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: contentTypes.TASKS_AND_ACTIVITIES,

  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: contentTypes.ASSESSMENT_RESOURCES,

  [RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES]:
    contentTypes.EXTERNAL_LEARNING_RESOURCES,

  [RESOURCE_TYPE_SOURCE_MATERIAL]: contentTypes.SOURCE_MATERIAL,

  default: contentTypes.SUBJECT_MATERIAL,
};

export const resourceTypeMapping = {
  [contentTypes.LEARNING_PATH]: RESOURCE_TYPE_LEARNING_PATH,

  [contentTypes.SUBJECT_MATERIAL]: RESOURCE_TYPE_SUBJECT_MATERIAL,

  [contentTypes.TASKS_AND_ACTIVITIES]: RESOURCE_TYPE_TASKS_AND_ACTIVITIES,

  [contentTypes.ASSESSMENT_RESOURCES]: RESOURCE_TYPE_ASSESSMENT_RESOURCES,

  [contentTypes.EXTERNAL_LEARNING_RESOURCES]: RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,

  [contentTypes.SOURCE_MATERIAL]: RESOURCE_TYPE_SOURCE_MATERIAL,

  default: RESOURCE_TYPE_SUBJECT_MATERIAL,
};

function getContentTypeFromResourceTypes(
  resourceTypes: GQLResourceType[] = [],
) {
  const resourceType = resourceTypes.find(type => contentTypeMapping[type.id]);
  if (resourceType) {
    return { contentType: contentTypeMapping[resourceType.id] };
  }
  return { contentType: contentTypeMapping.default };
}

export function getContentType(resourceOrTopic: GQLResource | GQLTopic) {
  if (resourceOrTopic.hasOwnProperty('subtopics')) {
    return contentTypes.TOPIC;
  } else {
    // @ts-ignore
    return getContentTypeFromResourceTypes(resourceOrTopic.resourceTypes)
      .contentType;
  }
}
