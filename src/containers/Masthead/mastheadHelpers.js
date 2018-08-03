/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toTopic, toSubjects } from '../../routeHelpers';

export function toTopicWithSubjectIdBound(subjectId, filters) {
  return toTopic.bind(undefined, subjectId, filters);
}

export function mapTopicResourcesToTopic(
  topics,
  selectedTopicId,
  topicResourcesByType,
  filters = '',
) {
  const filterParam =
    filters && filters.length > 0 ? `?filters=${filters}` : '';
  return topics.map(topic => {
    if (topic.id === selectedTopicId) {
      const contentTypeResults = topicResourcesByType.map(type => ({
        resources: type.resources
          .map(resource => ({
            ...resource,
            path: toSubjects() + resource.path + filterParam,
          }))
          .filter(resource => !resource.additional),
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
          filters,
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
