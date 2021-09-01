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
import {
  GQLMastheadQueryData,
  GQLResource,
  GQLResourceType,
  GQLTopic,
} from '../../graphqlTypes';

function getContentTypeResults(
  topicId: string,
  selectedTopicIds: string[],
  topicResourcesByType: GQLResourceType[],
) {
  if (!selectedTopicIds.includes(topicId)) {
    return;
  }
  return topicResourcesByType.map(type => ({
    contentType: contentTypeMapping[type.id],
    resources: type.resources,
    title: type.name,
  }));
}

export function mapTopicResourcesToTopic(
  topics: GQLTopic[],
  selectedTopicId: string,
  topicResourcesByType: GQLResourceType[],
  expandedSubTopics: string[] = [],
): (GQLTopic & {
  contentTypeResults:
    | {
        contentType: string | undefined;
        resources: GQLResource[] | undefined;
        title: string;
      }[]
    | undefined;
  subtopics: GQLTopic[];
})[] {
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

export function getSelectedTopic(topics: (string | undefined)[]) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}

export const mapMastheadData = ({
  subjectId,
  topicId,
  data: { resourceTypes, subject, topic, resource, subjects },
}: {
  subjectId: string;
  topicId: string;
  data: GQLMastheadQueryData;
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
    subject.topics &&
    subject.topics
      .filter(t => !t.parent || t.parent === subjectId)
      .map(t => toTopicMenu(t, subject.topics || []));

  const topicPath =
    subject &&
    subject.topics &&
    getTopicPath(subjectId, topicId, subject.topics);

  return {
    subject: {
      ...subject,
      topics: topicsWithSubTopics || [],
    },
    topicPath,
    topicResourcesByType,
    resource,
    subjects,
  };
};
