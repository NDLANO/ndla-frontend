/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Bookmark, Class } from '@ndla/icons/action';
import {
  GQLTopicMenuResourcesQuery,
  GQLTopicMenuResourcesQueryVariables,
  GQLTopicMenu_SubjectFragment,
} from '../../../graphqlTypes';
import { removeUrn } from '../../../routeHelpers';
import { useGraphQuery } from '../../../util/runQueries';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import { TopicWithSubTopics } from './SubjectMenu';

interface Props {
  topic: TopicWithSubTopics;
  subject: GQLTopicMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: TopicWithSubTopics[];
  addTopic: (topic: TopicWithSubTopics, index: number) => void;
  level: number;
  currentPath: string;
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

  return (
    <DrawerPortion>
      <BackButton
        title={topicPath[level - 2]?.name ?? subject.name}
        onGoBack={onCloseMenuPortion}
      />
      <DrawerRowHeader
        icon={<Icon />}
        type="link"
        to={path}
        title={topic.name}
        onClose={onClose}
      />
      {topic.subtopics.map(t => (
        <DrawerMenuItem
          key={t.id}
          type="button"
          active={topicPath[level]?.id === t.id}
          onClick={() => addTopic(t, level)}>
          {t.name}
        </DrawerMenuItem>
      ))}
      {data?.topic?.coreResources?.map(res => (
        <DrawerMenuItem
          type="link"
          to={`${path}/${removeUrn(res.id)}`}
          onClose={onClose}
          key={res.id}>
          {res.name}
        </DrawerMenuItem>
      ))}
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
