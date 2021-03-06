/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { contentTypeMapping } from '../../util/getContentType';
import { getResourceGroups } from '../Resources/getResourceGroups';
import { toTopicMenu } from '../../util/topicsHelper';
import { getTopicPath } from '../../util/getTopicPath';

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

export const mapMastheadData = ({
  subjectId,
  topicId,
  data: { resourceTypes, subject, topic, resource } = {},
}) => {
  const topicResourcesByType =
    topic &&
    getResourceGroups(
      resourceTypes || [],
      topic.supplementaryResources || [],
      topic.coreResources || [],
    );

  const topicsWithSubTopics =
    subject &&
    subject.topics
      .filter(t => !t.parent || t.parent === subjectId)
      .map(t => toTopicMenu(t, subject.topics));

  const topicPath =
    subject &&
    subject.topics &&
    getTopicPath(subjectId, topicId, subject.topics);

  const filters =
    subject &&
    subject.filters &&
    subject.filters.map(filter => ({
      ...filter,
      title: filter.name,
      value: filter.id,
    }));

  return {
    subject: {
      ...subject,
      topics: topicsWithSubTopics || [],
    },
    topicPath,
    filters,
    topicResourcesByType,
    resource,
  };
};
