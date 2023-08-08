/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants, HeroContentType } from '@ndla/ui';
import { GQLResource, GQLTopic } from '../graphqlTypes';

import {
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from '../constants';

const { contentTypes } = constants;

export const contentTypeMapping: Record<string, string> = {
  [RESOURCE_TYPE_LEARNING_PATH]: contentTypes.LEARNING_PATH,

  [RESOURCE_TYPE_SUBJECT_MATERIAL]: contentTypes.SUBJECT_MATERIAL,

  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: contentTypes.TASKS_AND_ACTIVITIES,

  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: contentTypes.ASSESSMENT_RESOURCES,

  [RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES]:
    contentTypes.EXTERNAL_LEARNING_RESOURCES,

  [RESOURCE_TYPE_SOURCE_MATERIAL]: contentTypes.SOURCE_MATERIAL,

  default: contentTypes.SUBJECT_MATERIAL,
};

export const resourceTypeMapping: Record<string, string> = {
  [contentTypes.LEARNING_PATH]: RESOURCE_TYPE_LEARNING_PATH,

  [contentTypes.SUBJECT_MATERIAL]: RESOURCE_TYPE_SUBJECT_MATERIAL,

  [contentTypes.TASKS_AND_ACTIVITIES]: RESOURCE_TYPE_TASKS_AND_ACTIVITIES,

  [contentTypes.ASSESSMENT_RESOURCES]: RESOURCE_TYPE_ASSESSMENT_RESOURCES,

  [contentTypes.EXTERNAL_LEARNING_RESOURCES]:
    RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,

  [contentTypes.SOURCE_MATERIAL]: RESOURCE_TYPE_SOURCE_MATERIAL,

  default: RESOURCE_TYPE_SUBJECT_MATERIAL,
};

export const resourceEmbedTypeMapping: Record<string, string> = {
  image: 'image',
  video: 'video',
  concept: 'concept',
  audio: 'audio',
};

interface ResourceType {
  id: string;
  name: string;
}

export function getContentTypeFromResourceTypes(
  resourceTypes: ResourceType[] = [],
) {
  const resourceType = resourceTypes.find(
    (type) => contentTypeMapping[type.id],
  );
  if (resourceType) {
    return {
      contentType: contentTypeMapping[resourceType.id],
      label: resourceType.name,
    };
  }
  return { contentType: contentTypeMapping.default };
}

const heroResourceTypes = [
  'subject-material',
  'tasks-and-activities',
  'assessment-resources',
  'subject',
  'external-learning-resources',
  'source-material',
  'learning-path',
  'topic',
  'beta',
  'ndla-film',
  'ndla-film has-image',
];

export const isHeroContentType = (type: string): type is HeroContentType => {
  if (heroResourceTypes.includes(type)) {
    return true;
  }
  return false;
};

export function getContentType(
  resourceOrTopic: Pick<GQLResource, 'id' | 'resourceTypes'> | GQLTopic,
) {
  if (isTopic(resourceOrTopic)) {
    return contentTypes.TOPIC;
  } else {
    return getContentTypeFromResourceTypes(resourceOrTopic.resourceTypes)
      .contentType;
  }
}

const isTopic = (
  resourceOrTopic: Pick<GQLResource | GQLTopic, 'id'>,
): resourceOrTopic is GQLTopic =>
  !!resourceOrTopic.id && resourceOrTopic.id.startsWith('urn:topic');
