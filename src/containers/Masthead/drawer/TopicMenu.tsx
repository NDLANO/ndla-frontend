/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Bookmark, Class } from '@ndla/icons/lib/action';
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
  topicPath: topicPathProp,
  addTopic,
  level,
}: Props) => {
  const [subtopic, ...topicPath] = topicPathProp;

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
    <>
      <DrawerPortion>
        <BackButton
          onGoBack={() => {}}
          title={parentIsTopic ? topic.name : subject.name}
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
            active={t.id === subtopic?.id}
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
      {subtopic && (
        <TopicMenu
          level={level + 1}
          key={subtopic.id}
          topic={subtopic}
          subject={subject}
          onClose={onClose}
          currentPath={path}
          topicPath={topicPath}
          addTopic={addTopic}
        />
      )}
    </>
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
