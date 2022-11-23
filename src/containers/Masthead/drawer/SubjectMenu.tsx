/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from 'lodash/partition';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import { ContentLoader } from '@ndla/ui';
import { MenuBook } from '@ndla/icons/action';
import { GQLSubjectMenu_SubjectFragment } from '../../../graphqlTypes';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import TopicMenu from './TopicMenu';
import DrawerRowHeader from './DrawerRowHeader';
import { removeUrn } from '../../../routeHelpers';
import BackButton from './BackButton';
import useArrowNavigation from './useArrowNavigation';

interface Props {
  subject?: GQLSubjectMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPathIds: string[];
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
}

type AllTopicsType = NonNullable<
  GQLSubjectMenu_SubjectFragment['allTopics']
>[0];

export type TopicWithSubTopics = AllTopicsType & {
  subtopics: TopicWithSubTopics[];
};

const placeholders = [0, 1, 2, 3, 4, 5];

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
      subject?.allTopics?.filter(t => !!t.parent),
      t => t.parent === subject?.id,
    );
    return roots.map(r => groupTopics(r, rest));
  }, [subject?.allTopics, subject?.id]);

  const topicPath = useMemo(
    () => constructTopicPath(groupedTopics ?? [], topicPathIds),
    [topicPathIds, groupedTopics],
  );

  const addTopic = useCallback(
    (topic: TopicWithSubTopics, index: number) => {
      setTopicPathIds(prev => prev.slice(0, index).concat(topic.id));
    },
    [setTopicPathIds],
  );

  const removeTopic = useCallback(
    (index: number) => {
      setTopicPathIds(prev => prev.slice(0, index));
    },
    [setTopicPathIds],
  );

  const keyboardAddTopic = useCallback(
    (id: string | undefined) => {
      const topic = groupedTopics.find(t => t.id === id);
      if (topic) {
        addTopic(topic, 0);
      }
    },
    [addTopic, groupedTopics],
  );

  useArrowNavigation(
    !topicPath.length,
    subject ? `header-${subject.id}` : undefined,
    keyboardAddTopic,
    onCloseMenuPortion,
  );

  const path = subject ? removeUrn(subject.id) : '';

  return (
    <>
      <DrawerPortion>
        <BackButton onGoBack={onCloseMenuPortion} title="Go home" homeButton />
        {subject ? (
          <DrawerList id={`list-${subject?.id}`}>
            <DrawerRowHeader
              id={subject.id}
              icon={<MenuBook />}
              title={subject.name}
              type="link"
              to={path}
              onClose={onClose}
            />
            {groupedTopics.map(t => (
              <DrawerMenuItem
                id={t.id}
                key={t.id}
                type="button"
                onClick={expanded => {
                  if (expanded) {
                    setTopicPathIds([]);
                  } else {
                    addTopic(t, 0);
                  }
                }}
                active={topicPath[0]?.id === t.id}>
                {t.name}
              </DrawerMenuItem>
            ))}
          </DrawerList>
        ) : (
          <ContentLoader
            height={'100%'}
            width={'100%'}
            viewBox={null}
            preserveAspectRatio="none">
            <rect x="5" y="2" rx="3" ry="3" height="50" width="90%" />
            {placeholders.map(p => (
              <rect
                key={p}
                x="20"
                y={65 + p * 30}
                rx="3"
                ry="3"
                height="25"
                width="80%"
              />
            ))}
          </ContentLoader>
        )}
      </DrawerPortion>
      {subject &&
        topicPath.map((topic, index) => (
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
            removeTopic={removeTopic}
          />
        ))}
    </>
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
