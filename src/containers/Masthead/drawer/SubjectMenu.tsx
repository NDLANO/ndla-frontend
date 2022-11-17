/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';
import { partition } from 'lodash';
import styled from '@emotion/styled';
import { gql } from '@apollo/client';
import { MenuBook } from '@ndla/icons/lib/action';
import { GQLSubjectMenu_SubjectFragment } from '../../../graphqlTypes';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import TopicMenu from './TopicMenu';
import DrawerRowHeader from './DrawerRowHeader';
import { removeUrn } from '../../../routeHelpers';
import { useMenuContext } from './MenuContext';
import BackButton from './BackButton';

interface Props {
  subject: GQLSubjectMenu_SubjectFragment;
  onClose: () => void;
  closeSubMenu: () => void;
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

const SubjectMenu = ({ subject, onClose, closeSubMenu }: Props) => {
  const [topic, setTopic] = useState<TopicWithSubTopics | undefined>(undefined);
  const { registerClose } = useMenuContext();
  const [roots, rest] = partition(
    subject.allTopics?.filter(t => !!t.parent),
    t => t.parent === subject.id,
  );
  const path = removeUrn(subject.id);
  const groupedTopics = roots.map(r => groupTopics(r, rest));

  useEffect(() => {
    registerClose(closeSubMenu);
  }, []);

  const closeTopic = useCallback(() => {
    setTopic(undefined);
  }, []);

  return (
    <MenuWrapper>
      <DrawerPortion>
        <BackButton onGoBack={closeSubMenu} title="Go home" homeButton />
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
            onClick={() => setTopic(t)}
            active={topic?.id === t.id}>
            {t.name}
          </DrawerMenuItem>
        ))}
      </DrawerPortion>
      {topic && (
        <TopicMenu
          key={topic.id}
          topic={topic}
          subject={subject}
          onClose={onClose}
          currentPath={path}
          closeTopic={closeTopic}
        />
      )}
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
