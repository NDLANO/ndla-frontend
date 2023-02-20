/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Bookmark, Class } from '@ndla/icons/action';
import { useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { ContentTypeBadge } from '@ndla/ui';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GQLTopicMenuResourcesQuery,
  GQLTopicMenuResourcesQueryVariables,
  GQLTopicMenu_SubjectFragment,
} from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import { TopicWithSubTopics } from './SubjectMenu';
import useArrowNavigation from './useArrowNavigation';
import {
  getResourceGroups,
  sortResourceTypes,
} from '../../Resources/getResourceGroups';
import ResourceTypeList from './ResourceTypeList';
import {
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../../constants';
import { contentTypeMapping } from '../../../util/getContentType';

interface Props {
  topic: TopicWithSubTopics;
  subject: GQLTopicMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: TopicWithSubTopics[];
  addTopic: (topic: TopicWithSubTopics, index: number) => void;
  level: number;
  removeTopic: (index: number) => void;
}

const StyledResourceSpan = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const TopicMenu = ({
  topic,
  subject,
  onClose,
  topicPath,
  onCloseMenuPortion,
  addTopic,
  level,
  removeTopic,
}: Props) => {
  const { t } = useTranslation();
  const parentIsTopic = topic.parent?.startsWith('urn:subject');
  const location = useLocation();
  const Icon = parentIsTopic ? Class : Bookmark;

  const { data } = useGraphQuery<
    GQLTopicMenuResourcesQuery,
    GQLTopicMenuResourcesQueryVariables
  >(resourceQuery, {
    variables: { topicId: topic.id, subjectId: subject.id },
  });

  const isUngrouped =
    data?.topic?.metadata?.customFields[
      TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES
    ] === TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE || false;

  const arrowAddTopic = useCallback(
    (id: string | undefined) => {
      const newTopic = topic.subtopics.find(t => t.id === id);
      if (newTopic) {
        addTopic(newTopic, level);
      }
    },
    [addTopic, level, topic.subtopics],
  );

  const active = useMemo(
    () => topicPath[topicPath.length - 1]?.id === topic.id,
    [topic, topicPath],
  );

  useArrowNavigation(
    active,
    active ? `header-${topic.id}` : topicPath[level]?.id,
    arrowAddTopic,
    onCloseMenuPortion,
  );

  const coreResources = useMemo(() => data?.topic?.coreResources ?? [], [
    data?.topic?.coreResources,
  ]);
  const supplementaryResources = useMemo(
    () => data?.topic?.supplementaryResources ?? [],
    [data?.topic?.supplementaryResources],
  );

  const sortedResources = useMemo(
    () =>
      sortBy(coreResources.concat(supplementaryResources), r => r.rank).map(
        r => ({
          ...r,
          resourceTypes: sortResourceTypes(r.resourceTypes ?? []),
        }),
      ),
    [coreResources, supplementaryResources],
  );

  const levelId = useMemo(() => topicPath[level]?.id, [topicPath, level]);
  const groupedResources = useMemo(
    () =>
      getResourceGroups(
        data?.resourceTypes ?? [],
        data?.topic?.supplementaryResources ?? [],
        data?.topic?.coreResources ?? [],
      ),
    [
      data?.resourceTypes,
      data?.topic?.supplementaryResources,
      data?.topic?.coreResources,
    ],
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
          current={location.pathname === topic.path}
          to={topic.path}
          title={topic.name}
          onClose={onClose}
        />
        {topic.subtopics.map(t => (
          <DrawerMenuItem
            id={t.id}
            key={t.id}
            current={t.path === location.pathname}
            type="button"
            active={levelId === t.id}
            onClick={expanded =>
              expanded ? removeTopic(level) : addTopic(t, level)
            }>
            {t.name}
          </DrawerMenuItem>
        ))}
        {!isUngrouped
          ? groupedResources.map(group => (
              <ResourceTypeList id={group.id} key={group.id} name={group.name}>
                {group.resources?.map(res => (
                  <DrawerMenuItem
                    id={`${topic.id}-${res.id}`}
                    type="link"
                    to={res.path}
                    current={res.path === location.pathname}
                    onClose={onClose}
                    key={res.id}>
                    {res.name}
                  </DrawerMenuItem>
                ))}
              </ResourceTypeList>
            ))
          : sortedResources.map(res => {
              const type = res.resourceTypes[0]
                ? contentTypeMapping[res.resourceTypes[0]?.id]!
                : 'subject-material';
              return (
                <DrawerMenuItem
                  id={`${topic.id}-${res.id}`}
                  type="link"
                  to={res.path}
                  current={res.path === location.pathname}
                  onClose={onClose}
                  key={res.id}>
                  <StyledResourceSpan
                    aria-label={`${res.name}, ${t(`contentTypes.${type}`)}`}>
                    <ContentTypeBadge type={type} border={false} />
                    {res.name}
                  </StyledResourceSpan>
                </DrawerMenuItem>
              );
            })}
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
      path
    }
  `,
};

const resourceQuery = gql`
  query topicMenuResources($subjectId: String!, $topicId: String!) {
    topic(id: $topicId, subjectId: $subjectId) {
      metadata {
        customFields
      }
      coreResources(subjectId: $subjectId) {
        ...TopicMenu_Resource
        rank
        resourceTypes {
          id
          name
        }
      }
      supplementaryResources(subjectId: $subjectId) {
        ...TopicMenu_Resource
        rank
        resourceTypes {
          id
          name
        }
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${TopicMenu.fragments.resource}
`;

export default TopicMenu;
