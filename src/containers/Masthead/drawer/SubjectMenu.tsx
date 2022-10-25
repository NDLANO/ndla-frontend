/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { gql } from '@apollo/client';
import { GQLSubjectMenu_SubjectFragment } from '../../../graphqlTypes';
import { MenuType } from './drawerMenuTypes';
import { partition } from 'lodash';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import { useState } from 'react';
import TopicMenu from './TopicMenu';

interface Props {
  subject: GQLSubjectMenu_SubjectFragment;
  onClose: () => void;
  setActiveMenu: (type: MenuType) => void;
}

const MenuPortion = styled(DrawerPortion)`
  display: flex;
  flex-direction: column;
`;

const MenuWrapper = styled.div`
  display: flex;
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

const SubjectMenu = ({ subject }: Props) => {
  const [topic, setTopic] = useState<TopicWithSubTopics | undefined>(undefined);
  const [roots, rest] = partition(
    subject.allTopics?.filter(t => !!t.parent),
    t => t.parent === subject.id,
  );
  const groupedTopics = roots.map(r => groupTopics(r, rest));
  return (
    <MenuWrapper>
      <MenuPortion>
        {groupedTopics.map(t => (
          <DrawerMenuItem key={t.id} type="button" onClick={() => setTopic(t)}>
            {t.name}
          </DrawerMenuItem>
        ))}
      </MenuPortion>
      {topic && <TopicMenu topic={topic} subject={subject} />}
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
