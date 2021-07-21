/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { tType } from '@ndla/i18n';
import { fixEndSlash } from '../routeHelpers';
import { GQLTopic } from '../graphqlTypes';

interface GroupedSubTopics {
  [key: string]: Array<GQLTopic>;
}

export const groupedSubtopicsByParent = (topics: GQLTopic[] = []) =>
  topics
    .filter(topic => topic.parent)
    .reduce((groupedtopics, topic) => {
      groupedtopics[topic['parent']!] = groupedtopics[topic['parent']!] || [];
      groupedtopics[topic['parent']!]!.push(topic);
      return groupedtopics;
    }, {} as GroupedSubTopics);

export const toTopicMenu = (topic: GQLTopic, topics: GQLTopic[]) => {
  const groupedSubTopics = groupedSubtopicsByParent(topics);
  const subtopics = defined(groupedSubTopics[topic.id], []);
  const subtopicsWithSubtopics = subtopics.map((child: GQLTopic) =>
    toTopicMenu(child, topics),
  );
  return {
    ...topic,
    ...(topic.path && { path: fixEndSlash(topic.path) }),
    introduction:
      topic.meta && topic.meta.metaDescription
        ? topic.meta.metaDescription
        : '',
    subtopics: subtopicsWithSubtopics,
  };
};

export const topicIntroductionMessages = (t: tType['t']) => ({
  noContentBoxLabel: t('resource.noCoreResourcesAvailableUnspecific'),
  noContentBoxButtonText: t('resource.activateAdditionalResources'),
  shortcutButtonText: t('resource.shortcutButtonText'),
  coreTooltip: t('resource.tooltipCoreTopic'),
  additionalTooltip: t('resource.tooltipAdditionalTopic'),
});
