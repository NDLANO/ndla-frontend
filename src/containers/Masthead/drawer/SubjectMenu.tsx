/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { partition } from 'lodash';
import styled from '@emotion/styled';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import { MenuBook } from '@ndla/icons/lib/action';
import { GQLSubjectMenu_SubjectFragment } from '../../../graphqlTypes';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import TopicMenu from './TopicMenu';
import DrawerRowHeader from './DrawerRowHeader';
import { removeUrn } from '../../../routeHelpers';
import BackButton from './BackButton';

interface Props {
  subject: GQLSubjectMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPathIds: string[];
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
}

const MenuWrapper = styled.div`
  display: flex;
  flex: 1;
`;

type AllTopicsType = NonNullable<
  GQLSubjectMenu_SubjectFragment['allTopics']
>[0];

export type TopicWithSubTopics = AllTopicsType & {
  subtopics: TopicWithSubTopics[];
};

const groupTopics = (
  root: AllTopicsType,
  topics: AllTopicsType[],
): TopicWithSubTopics => {
  const [children, descendants] = partition(topics, t => t.parent === root.id);
  return {
    ...root,
    subtopics: children.map(c => groupTopics(c, descendants)),
  };
};

const constructTopicPath = (
  topics: TopicWithSubTopics[],
  topicList: string[],
): TopicWithSubTopics[] => {
  if (!topicList.length) return [];
  const topic = topics.find(t => t.id === topicList[0])!;
  return [topic].concat(
    constructTopicPath(topic.subtopics, topicList.slice(1)),
  );
};

const SubjectMenu = ({
  subject,
  onClose,
  onCloseMenuPortion,
  setTopicPathIds,
  topicPathIds,
}: Props) => {
  const groupedTopics = useMemo(() => {
    const [roots, rest] = partition(
      subject.allTopics?.filter(t => !!t.parent),
      t => t.parent === subject.id,
    );
    return roots.map(r => groupTopics(r, rest));
  }, [subject.allTopics, subject.id]);

  const topicPath = useMemo(
    () => constructTopicPath(groupedTopics ?? [], topicPathIds),
    [topicPathIds, groupedTopics],
  );

  const path = removeUrn(subject.id);

  const addTopic = useCallback(
    (topic: TopicWithSubTopics, index: number) => {
      setTopicPathIds(prev => prev.slice(0, index).concat(topic.id));
    },
    [setTopicPathIds],
  );

  return (
    <MenuWrapper>
      <DrawerPortion>
        <BackButton onGoBack={onCloseMenuPortion} title="Go home" homeButton />
        <DrawerRowHeader
          icon={<MenuBook />}
          title={subject.name}
          type="link"
          to={path}
          onClose={onClose}
        />
        {groupedTopics.map(t => (
          <DrawerMenuItem
            key={t.id}
            type="button"
            onClick={() => addTopic(t, 0)}
            active={topicPath[0]?.id === t.id}>
            {t.name}
          </DrawerMenuItem>
        ))}
      </DrawerPortion>
      {topicPath.map((topic, index) => (
        <TopicMenu
          key={topic.id}
          onCloseMenuPortion={onCloseMenuPortion}
          level={index + 1}
          topic={topic}
          subject={subject}
          onClose={onClose}
          currentPath={path}
          topicPath={topicPath}
          addTopic={addTopic}
        />
      ))}
    </MenuWrapper>
  );
};

SubjectMenu.fragments = {
  subject: gql`
    fragment SubjectMenu_Subject on Subject {
      id
      name
      allTopics {
        id
        name
        parent
      }
      ...TopicMenu_Subject
    }
    ${TopicMenu.fragments.subject}
  `,
};

export default SubjectMenu;
