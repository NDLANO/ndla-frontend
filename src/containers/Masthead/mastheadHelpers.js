/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toTopic } from '../../routeHelpers';
import { contentTypeMapping } from '../../util/getContentTypeFromResourceTypes';

export function toTopicWithSubjectIdBound(subjectId, filters) {
  return toTopic.bind(undefined, subjectId, filters);
}

export function mapTopicResourcesToTopic(
  topics,
  selectedTopicId,
  topicResourcesByType,
  expandedSubTopics = [],
) {
  return topics.map(topic => {
    if (
      (expandedSubTopics.length === 0 && topic.id === selectedTopicId) ||
      expandedSubTopics.includes(topic.id)
    ) {
      const contentTypeResults = topicResourcesByType.map(type => ({
        contentType: contentTypeMapping[type.id].contentType,
        resources: type.resources.map(resource => ({
          ...resource,
          path: resource.path,
          additional: resource.additional,
        })),
        title: type.name,
      }));
      return { ...topic, contentTypeResults };
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: mapTopicResourcesToTopic(
          topic.subtopics,
          selectedTopicId,
          topicResourcesByType,
          expandedSubTopics,
        ),
      };
    }
    return topic;
  });
}

export function getSelectedTopic(topics) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}
