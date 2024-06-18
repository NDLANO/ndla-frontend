/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import parse from "html-react-parser";
import { Dispatch, SetStateAction, useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { misc, spacing, mq, colors } from "@ndla/core";
import { Switch } from "@ndla/switch";
import { Heading } from "@ndla/typography";
import { useSnack } from "@ndla/ui";
import { breakpoints } from "@ndla/util";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { PostWrapper, PostCardWrapper, Content, PostHeader, ContentWrapper, FlexLine, TimestampText } from "./PostCard";
import { useArenaUpdateTopic, useArenaDeleteTopic } from "./temporaryNodebbHooks";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { routes } from "../../../../routeHelpers";
import { useUserAgent } from "../../../../UserAgentContext";
import { formatDateTime } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
  border: 2px solid transparent;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    align-self: flex-end;
    margin-bottom: ${spacing.small};
  }
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: ${colors.brand.dark};
  }
`;

interface Props {
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  post: Omit<GQLArenaPostV2Fragment, "replies">;
  onFollowChange: (value: boolean) => Promise<void>;
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setReplyingTo: VoidFunction;
  isReplying: boolean;
}

const MainPostCard = ({ topic, post, onFollowChange, setFocusId, setReplyingTo, isReplying }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML } = post;
  const replyToRef = useRef<HTMLButtonElement | null>(null);
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { updateTopic } = useArenaUpdateTopic(topicId);
  const { addSnack } = useSnack();
  const { deleteTopic } = useArenaDeleteTopic(topic?.categoryId);
  const navigate = useNavigate();
  const selectors = useUserAgent();

  const deleteTopicCallback = useCallback(
    async (close: VoidFunction) => {
      await deleteTopic({ variables: { topicId } });
      close();
      addSnack({
        content: t("myNdla.arena.deleted.topic"),
        id: "arenaTopicDeleted",
      });
      if (topic?.categoryId) {
        navigate(routes.myNdla.arenaCategory(topic.categoryId));
      } else {
        navigate(routes.myNdla.arena);
      }
    },
    [topicId, deleteTopic, navigate, topic?.categoryId, addSnack, t],
  );
  const timeDistance = formatDistanceStrict(Date.parse(created), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[language],
    roundingMethod: "floor",
  });

  const followSwitch = useMemo(
    () => (
      <StyledSwitch
        onChange={onFollowChange}
        checked={!!topic?.isFollowing}
        label={t("myNdla.arena.posts.notify")}
        id={t("myNdla.arena.posts.notify")}
      />
    ),
    [onFollowChange, topic?.isFollowing, t],
  );

  const profileTag = useMemo(() => <UserProfileTag user={post.owner} />, [post.owner]);

  const header = useMemo(
    () =>
      selectors?.isMobile ? (
        <>
          {followSwitch}
          {profileTag}
        </>
      ) : (
        <>
          {profileTag}
          {followSwitch}
        </>
      ),
    [followSwitch, profileTag, selectors?.isMobile],
  );

  return (
    <PostWrapper>
      <PostCardWrapper id={`post-${postId}`}>
        {isEditing ? (
          <ArenaForm
            id={postId}
            type={"topic"}
            initialTitle={topic?.title}
            initialLocked={topic?.isLocked}
            initialContent={post.content}
            onAbort={() => setIsEditing(false)}
            onSave={async (values) => {
              await updateTopic({
                variables: {
                  topicId,
                  title: values.title ?? "",
                  content: values.content ?? "",
                  isLocked: values.locked ?? false,
                },
              });
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <PostHeader>{header}</PostHeader>
            <ContentWrapper>
              <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h4" margin="none">
                {topic?.title}
              </Heading>
              <Content element="div" textStyle="content-alt" margin="none">
                {parse(contentAsHTML!)}
              </Content>
            </ContentWrapper>
            <FlexLine>
              <FlexLine>
                <PostAction
                  topic={topic}
                  post={post}
                  type={"topic"}
                  setFocusId={setFocusId}
                  setIsEditing={setIsEditing}
                  onDelete={deleteTopicCallback}
                />
                <TimestampText element="span" textStyle="content-alt" margin="none">
                  <span title={formatDateTime(created, language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
                </TimestampText>
              </FlexLine>
              <ButtonV2 ref={replyToRef} onClick={setReplyingTo} disabled={isReplying || topic?.isLocked}>
                {t("myNdla.arena.new.post")}
              </ButtonV2>
            </FlexLine>
          </>
        )}
      </PostCardWrapper>
    </PostWrapper>
  );
};

export default MainPostCard;
