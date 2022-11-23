/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { contentTypeMapping } from '../../util/getContentType';
import { GQLResource, GQLResourceType, GQLTopic } from '../../graphqlTypes';

function getContentTypeResults(
  topicId: string,
  selectedTopicIds: string[],
  topicResourcesByType: GQLResourceType[],
) {
  if (!selectedTopicIds.includes(topicId)) {
    return [];
  }
  return topicResourcesByType.map(type => ({
    contentType: contentTypeMapping[type.id],
    resources: type.resources,
    title: type.name,
  }));
}

type TransformedTopic = Omit<GQLTopic, 'subtopics' | 'metadata' | 'paths'> & {
  contentTypeResults: {
    contentType: string | undefined;
    resources: GQLResource[] | undefined;
    title: string;
  }[];
  subtopics: TransformedTopic[];
};

export function mapTopicResourcesToTopic(
  topics: Omit<GQLTopic, 'metadata' | 'paths'>[],
  selectedTopicId: string,
  topicResourcesByType: GQLResourceType[],
  expandedSubTopics: string[] = [],
): TransformedTopic[] {
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
