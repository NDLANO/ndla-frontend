/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { useState } from 'react';
import {
  GQLTopicMenuResourcesQuery,
  GQLTopicMenuResourcesQueryVariables,
  GQLTopicMenu_SubjectFragment,
} from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import { TopicWithSubTopics } from './SubjectMenu';

interface Props {
  topic: TopicWithSubTopics;
  subject: GQLTopicMenu_SubjectFragment;
}

const MenuPortion = styled(DrawerPortion)`
  display: flex;
  flex-direction: column;
`;

const TopicMenu = ({ topic, subject }: Props) => {
  const [subtopic, setSubtopic] = useState<TopicWithSubTopics | undefined>(
    undefined,
  );

  const { data } = useGraphQuery<
    GQLTopicMenuResourcesQuery,
    GQLTopicMenuResourcesQueryVariables
  >(resourceQuery, {
    variables: { topicId: topic.id, subjectId: subject.id },
  });

  return (
    <>
      <MenuPortion>
        {topic.subtopics.map(t => (
          <DrawerMenuItem type="button" onClick={() => setSubtopic(t)}>
            {t.name}
          </DrawerMenuItem>
        ))}
        {data?.topic?.coreResources?.map(res => (
          <p>{res.name}</p>
        ))}
      </MenuPortion>
      {subtopic && <TopicMenu topic={subtopic} subject={subject} />}
    </>
  );
};

TopicMenu.fragments = {
  subject: gql`
    fragment TopicMenu_Subject on Subject {
      id
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
