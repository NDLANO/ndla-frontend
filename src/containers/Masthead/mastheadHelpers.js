/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toTopic } from '../../routeHelpers';
import { contentTypeMapping } from '../../util/getContentType';

export function toTopicWithSubjectIdBound(subjectId, filters) {
  return toTopic.bind(undefined, subjectId, filters);
}

function getContentTypeResults(
  topicId,
  selectedTopicIds,
  topicResourcesByType,
) {
  if (!selectedTopicIds.includes(topicId)) {
    return null;
  }
  return topicResourcesByType.map(type => ({
    contentType: contentTypeMapping[type.id],
    resources: type.resources,
    title: type.name,
  }));
}

export function mapTopicResourcesToTopic(
  topics,
  selectedTopicId,
  topicResourcesByType,
  expandedSubTopics = [],
) {
  return topics.map(topic => {
    const subtopics =
      topic.subtopics && topic.subtopics.length > 0
        ? mapTopicResourcesToTopic(
            topic.subtopics,
            selectedTopicId,
            topicResourcesByType,
            expandedSubTopics,
          )
        : [];

    const contentTypeResults = getContentTypeResults(
      topic.id,
      [selectedTopicId, ...expandedSubTopics],
      topicResourcesByType,
    );

    return {
      ...topic,
      contentTypeResults,
      subtopics,
    };
  });
}

export function getSelectedTopic(topics) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}
