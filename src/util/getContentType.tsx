/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { contentTypes } from "@ndla/ui";
import {
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from "../constants";
import { GQLResource, GQLTopic } from "../graphqlTypes";

export const contentTypeMapping: Record<string, string> = {
  [RESOURCE_TYPE_LEARNING_PATH]: contentTypes.LEARNING_PATH,

  [RESOURCE_TYPE_SUBJECT_MATERIAL]: contentTypes.SUBJECT_MATERIAL,

  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: contentTypes.TASKS_AND_ACTIVITIES,

  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: contentTypes.ASSESSMENT_RESOURCES,

  [RESOURCE_TYPE_CONCEPT]: contentTypes.CONCEPT,

  [RESOURCE_TYPE_SOURCE_MATERIAL]: contentTypes.SOURCE_MATERIAL,

  default: contentTypes.SUBJECT_MATERIAL,
};

export const resourceEmbedTypeMapping: Record<string, string> = {
  image: "image",
  video: "video",
  audio: "audio",
};

interface ResourceType {
  id: string;
  name: string;
}

export function getContentTypeFromResourceTypes(resourceTypes: ResourceType[] = []) {
  const resourceType = resourceTypes.find((type) => contentTypeMapping[type.id]);
  if (resourceType) {
    return {
      contentType: contentTypeMapping[resourceType.id],
      label: resourceType.name,
    };
  }
  return undefined;
}

export function getContentType(resourceOrTopic: Pick<GQLResource, "id" | "resourceTypes"> | GQLTopic | undefined) {
  if (!resourceOrTopic) {
    return undefined;
  }
  if (isTopic(resourceOrTopic)) {
    return contentTypes.TOPIC;
  } else {
    return getContentTypeFromResourceTypes(resourceOrTopic.resourceTypes)?.contentType;
  }
}

const isTopic = (resourceOrTopic: Pick<GQLResource | GQLTopic, "id">): resourceOrTopic is GQLTopic =>
  !!resourceOrTopic.id && resourceOrTopic.id.startsWith("urn:topic");
