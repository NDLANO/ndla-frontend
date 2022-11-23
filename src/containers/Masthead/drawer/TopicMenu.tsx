/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Bookmark, Class } from '@ndla/icons/action';
import { useCallback } from 'react';
import {
  GQLTopicMenuResourcesQuery,
  GQLTopicMenuResourcesQueryVariables,
  GQLTopicMenu_SubjectFragment,
} from '../../../graphqlTypes';
import { removeUrn } from '../../../routeHelpers';
import { useGraphQuery } from '../../../util/runQueries';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import { TopicWithSubTopics } from './SubjectMenu';
import useArrowNavigation from './useArrowNavigation';

interface Props {
  topic: TopicWithSubTopics;
  subject: GQLTopicMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: TopicWithSubTopics[];
  addTopic: (topic: TopicWithSubTopics, index: number) => void;
  level: number;
  currentPath: string;
  removeTopic: (index: number) => void;
}

const TopicMenu = ({
  topic,
  subject,
  onClose,
  currentPath,
  topicPath,
  onCloseMenuPortion,
  addTopic,
  level,
  removeTopic,
}: Props) => {
  const path = `${currentPath}/${removeUrn(topic.id)}`;
  const parentIsTopic = currentPath.split('/').length > 1;
  const Icon = parentIsTopic ? Class : Bookmark;

  const { data } = useGraphQuery<
    GQLTopicMenuResourcesQuery,
    GQLTopicMenuResourcesQueryVariables
  >(resourceQuery, {
    variables: { topicId: topic.id, subjectId: subject.id },
  });

  const arrowAddTopic = useCallback(
    (id: string | undefined) => {
      const newTopic = topic.subtopics.find(t => t.id === id);
      if (newTopic) {
        addTopic(newTopic, level);
      }
    },
    [addTopic, level, topic.subtopics],
  );

  useArrowNavigation(
    topicPath[topicPath.length - 1]?.id === topic.id,
    `header-${topic.id}`,
    arrowAddTopic,
    onCloseMenuPortion,
  );

  return (
    <DrawerPortion>
      <BackButton
        title={topicPath[level - 2]?.name ?? subject.name}
        onGoBack={onCloseMenuPortion}
      />
      <DrawerList id={`list-${topic.id}`}>
        <DrawerRowHeader
          id={topic.id}
          icon={<Icon />}
          type="link"
          to={path}
          title={topic.name}
          onClose={onClose}
        />
        {topic.subtopics.map(t => (
          <DrawerMenuItem
            id={t.id}
            key={t.id}
            type="button"
            active={topicPath[level]?.id === t.id}
            onClick={expanded =>
              expanded ? removeTopic(level) : addTopic(t, level)
            }>
            {t.name}
          </DrawerMenuItem>
        ))}
        {data?.topic?.coreResources?.map(res => (
          <DrawerMenuItem
            id={res.id}
            type="link"
            to={`${path}/${removeUrn(res.id)}`}
            onClose={onClose}
            key={res.id}>
            {res.name}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

TopicMenu.fragments = {
  subject: gql`
    fragment TopicMenu_Subject on Subject {
      id
      name
    }
  `,
  resource: gql`
    fragment TopicMenu_Resource on Resource {
      id
      name
    }
  `,
};

const resourceQuery = gql`
  query topicMenuResources($subjectId: String!, $topicId: String!) {
    topic(id: $topicId, subjectId: $subjectId) {
      coreResources(subjectId: $subjectId) {
        ...TopicMenu_Resource
      }
      supplementaryResources(subjectId: $subjectId) {
        ...TopicMenu_Resource
      }
    }
  }
  ${TopicMenu.fragments.resource}
`;

export default TopicMenu;
