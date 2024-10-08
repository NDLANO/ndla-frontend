/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import BackButton from "./BackButton";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { DrawerPortion, DrawerHeaderLink, DrawerList, DrawerListItem } from "./DrawerPortion";
import ResourceTypeList from "./ResourceTypeList";
import { TopicWithSubTopics } from "./SubjectMenu";
import useArrowNavigation from "./useArrowNavigation";
import { TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES, TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE } from "../../../constants";
import {
  GQLTopicMenuResourcesQuery,
  GQLTopicMenuResourcesQueryVariables,
  GQLTopicMenu_SubjectFragment,
} from "../../../graphqlTypes";
import { useGraphQuery } from "../../../util/runQueries";
import { getResourceGroupings, getResourceGroups } from "../../Resources/getResourceGroups";

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

const TopicMenu = ({ topic, subject, onClose, topicPath, onCloseMenuPortion, addTopic, level, removeTopic }: Props) => {
  const location = useLocation();
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();

  const { data } = useGraphQuery<GQLTopicMenuResourcesQuery, GQLTopicMenuResourcesQueryVariables>(resourceQuery, {
    variables: { topicId: topic.id, subjectId: subject.id },
  });

  const isUngrouped =
    data?.topic?.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] ===
      TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE || false;

  const arrowAddTopic = useCallback(
    (id: string | undefined) => {
      const newTopic = topic.subtopics.find((t) => t.id === id);
      if (newTopic) {
        addTopic(newTopic, level);
      }
    },
    [addTopic, level, topic.subtopics],
  );

  const active = useMemo(() => topicPath[topicPath.length - 1]?.id === topic.id, [topic, topicPath]);
  useArrowNavigation(active, {
    initialFocused: active ? `header-${topic.id}` : topicPath[level]?.id,
    onRightKeyPressed: arrowAddTopic,
    onLeftKeyPressed: onCloseMenuPortion,
  });

  useEffect(() => {
    if (active && shouldCloseLevel) {
      onCloseMenuPortion();
      setLevelClosed();
    }
  }, [active, shouldCloseLevel, setLevelClosed, onCloseMenuPortion]);

  const { sortedResources } = useMemo(
    () => getResourceGroupings(data?.topic?.coreResources?.concat(data?.topic?.supplementaryResources ?? []) ?? []),
    [data?.topic?.coreResources, data?.topic?.supplementaryResources],
  );

  const levelId = useMemo(() => topicPath[level]?.id, [topicPath, level]);
  const groupedResources = useMemo(
    () => getResourceGroups(data?.resourceTypes ?? [], sortedResources),
    [data?.resourceTypes, sortedResources],
  );

  return (
    <DrawerPortion>
      <BackButton title={topicPath[level - 2]?.name ?? subject.name} onGoBack={onCloseMenuPortion} />
      <DrawerList id={`list-${topic.id}`}>
        <DrawerListItem role="none" data-list-item>
          <DrawerHeaderLink
            variant="link"
            aria-current={
              location.pathname.replaceAll("/", "") === topic.path?.replaceAll("/", "") ? "page" : undefined
            }
            tabIndex={-1}
            role="menuitem"
            to={topic.path || ""}
            onClick={onClose}
            id={`header-${topic.id}`}
          >
            {topic.name}
          </DrawerHeaderLink>
        </DrawerListItem>
        {topic.subtopics.map((t) => (
          <DrawerMenuItem
            id={t.id}
            key={t.id}
            type="button"
            current={t.path === location.pathname}
            active={levelId === t.id}
            onClick={(expanded) => (expanded ? removeTopic(level) : addTopic(t, level))}
          >
            {t.name}
          </DrawerMenuItem>
        ))}
        {!isUngrouped
          ? groupedResources.map((group) => (
              <ResourceTypeList id={group.id} key={group.id} name={group.name}>
                {group.resources?.map((res) => (
                  <DrawerMenuItem
                    id={`${topic.id}-${res.id}`}
                    type="link"
                    to={res.path || ""}
                    current={res.path === location.pathname}
                    onClose={onClose}
                    key={res.id}
                  >
                    {res.name}
                  </DrawerMenuItem>
                ))}
              </ResourceTypeList>
            ))
          : sortedResources.map((res) => {
              return (
                <DrawerMenuItem
                  id={`${topic.id}-${res.id}`}
                  type="link"
                  to={res.path || ""}
                  current={res.path === location.pathname}
                  onClose={onClose}
                  key={res.id}
                >
                  {res.name}
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
      relevanceId
      rank
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
