/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from "lodash/partition";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { Skeleton } from "@ndla/primitives";
import { VStack } from "@ndla/styled-system/jsx";
import BackButton from "./BackButton";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { DrawerPortion, DrawerHeaderLink, DrawerList, DrawerListItem } from "./DrawerPortion";
import TopicMenu from "./TopicMenu";
import useArrowNavigation from "./useArrowNavigation";
import { GQLSubjectMenu_SubjectFragment, GQLTaxBase } from "../../../graphqlTypes";

interface Props {
  subject?: GQLSubjectMenu_SubjectFragment;
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPathIds: string[];
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
}

type AllTopicsType = NonNullable<GQLSubjectMenu_SubjectFragment["allTopics"]>[0];

export type TopicWithSubTopics = AllTopicsType & {
  subtopics: TopicWithSubTopics[];
};

const placeholders = [0, 1, 2, 3, 4, 5];

const groupTopics = (root: AllTopicsType, topics: AllTopicsType[]): TopicWithSubTopics => {
  const [children, descendants] = partition(topics, (t) => t.parentId === root.id);
  return {
    ...root,
    subtopics: children.map((c) => groupTopics(c, descendants)),
  };
};

const constructTopicPath = (topics: TopicWithSubTopics[], topicList: string[]): TopicWithSubTopics[] => {
  if (!topicList.length || !topics.length) return [];
  const topic = topics.find((t) => t.id === topicList[0])!;
  if (!topic) {
    return [];
  }
  return [topic].concat(constructTopicPath(topic.subtopics, topicList.slice(1)));
};

export const isCurrent = (pathname: string, taxBase: Pick<GQLTaxBase, "path" | "url">) => {
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return path === taxBase.path || path === taxBase.url;
};

const SubjectMenu = ({ subject, onClose, onCloseMenuPortion, setTopicPathIds, topicPathIds }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();
  const groupedTopics = useMemo(() => {
    const [roots, rest] = partition(
      subject?.allTopics?.filter((t) => !!t.parentId),
      (t) => t.parentId === subject?.id,
    );
    return roots.map((r) => groupTopics(r, rest));
  }, [subject?.allTopics, subject?.id]);

  const topicPath = useMemo(() => constructTopicPath(groupedTopics ?? [], topicPathIds), [topicPathIds, groupedTopics]);

  useEffect(() => {
    if (!topicPath.length && shouldCloseLevel) {
      onCloseMenuPortion();
      setLevelClosed();
    }
  }, [topicPath.length, shouldCloseLevel, onCloseMenuPortion, setLevelClosed]);

  const addTopic = useCallback(
    (topic: TopicWithSubTopics, index: number) => {
      setTopicPathIds((prev) => prev.slice(0, index).concat(topic.id));
    },
    [setTopicPathIds],
  );

  const removeTopic = useCallback(
    (index: number) => {
      setTopicPathIds((prev) => prev.slice(0, index));
    },
    [setTopicPathIds],
  );

  const keyboardAddTopic = useCallback(
    (id: string | undefined) => {
      const topic = groupedTopics.find((t) => t.id === id);
      if (topic) {
        addTopic(topic, 0);
      }
    },
    [addTopic, groupedTopics],
  );

  useArrowNavigation(!topicPath.length, {
    initialFocused: topicPath.length ? topicPath[0]?.id : subject ? `header-${subject.id}` : undefined,
    onLeftKeyPressed: onCloseMenuPortion,
    onRightKeyPressed: keyboardAddTopic,
  });

  const path = subject?.path ?? "";

  return (
    <>
      <DrawerPortion>
        <BackButton onGoBack={onCloseMenuPortion} title={t("masthead.menu.goToMainMenu")} homeButton />
        {subject ? (
          <DrawerList id={`list-${subject?.id}`}>
            <DrawerListItem role="none" data-list-item>
              <DrawerHeaderLink
                variant="link"
                aria-current={isCurrent(location.pathname, subject) ? "page" : undefined}
                id={`header-${subject.id}`}
                to={path}
                onClick={onClose}
                tabIndex={-1}
                role="menuitem"
              >
                {subject.name}
              </DrawerHeaderLink>
            </DrawerListItem>

            {groupedTopics.map((t) => (
              <DrawerMenuItem
                id={t.id}
                key={t.id}
                type="button"
                current={isCurrent(location.pathname, t)}
                onClick={(expanded) => {
                  if (expanded) {
                    setTopicPathIds([]);
                  } else {
                    addTopic(t, 0);
                  }
                }}
                active={topicPath[0]?.id === t.id}
              >
                {t.name}
              </DrawerMenuItem>
            ))}
          </DrawerList>
        ) : (
          <VStack gap="small" justify="flex-start">
            <Skeleton css={{ width: "100%", height: "xxlarge" }} />
            {placeholders.map((p) => (
              <Skeleton key={p} css={{ width: "100%", height: "large" }} />
            ))}
          </VStack>
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
      path
      url
      allTopics {
        id
        name
        parentId
        path
        url
      }
      ...TopicMenu_Subject
    }
    ${TopicMenu.fragments.subject}
  `,
};

export default SubjectMenu;
