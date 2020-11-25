/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../constants';

const { contentTypes } = constants;

export const contentTypeMapping = {
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

function getContentTypeFromResourceTypes(resourceTypes = []) {
  const resourceType = resourceTypes.find(type => contentTypeMapping[type.id]);
  if (resourceType) {
    return { contentType: contentTypeMapping[resourceType.id] };
  }
  return { contentType: contentTypeMapping.default };
}

export function getContentType(resourceOrTopic) {
  if (resourceOrTopic.id && resourceOrTopic.id.startsWith('urn:topic')) {
    return contentTypes.TOPIC;
  }
  return getContentTypeFromResourceTypes(resourceOrTopic.resourceTypes)
    .contentType;
}
