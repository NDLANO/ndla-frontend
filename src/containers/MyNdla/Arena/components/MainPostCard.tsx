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
import { Button, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { Heading } from "@ndla/typography";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { PostWrapper, PostCardWrapper, Content, PostHeader, ContentWrapper, FlexLine } from "./PostCard";
import { useArenaUpdateTopic, useArenaDeleteTopic } from "./temporaryNodebbHooks";
import VotePost from "./VotePost";
import { useToast } from "../../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { routes } from "../../../../routeHelpers";
import { useUserAgent } from "../../../../UserAgentContext";
import { formatDateTime } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  post: Omit<GQLArenaPostV2Fragment, "replies">;
  onFollowChange: () => Promise<void>;
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setReplyingTo: VoidFunction;
  isReplying: boolean;
}

const MainPostCard = ({ topic, post, onFollowChange, setFocusId, setReplyingTo, isReplying }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML } = post;
  const replyToRef = useRef<HTMLButtonElement | null>(null);
  const { t, i18n } = useTranslation();
  const { updateTopic } = useArenaUpdateTopic(topicId);
  const toast = useToast();
  const { deleteTopic } = useArenaDeleteTopic(topic?.categoryId);
  const navigate = useNavigate();
  const selectors = useUserAgent();

  const deleteTopicCallback = useCallback(
    async (close: VoidFunction) => {
      await deleteTopic({ variables: { topicId } });
      close();
      toast.create({
        title: t("myNdla.arena.deleted.topic"),
      });
      if (topic?.categoryId) {
        navigate(routes.myNdla.arenaCategory(topic.categoryId));
      } else {
        navigate(routes.myNdla.arena);
      }
    },
    [deleteTopic, topicId, toast, t, topic?.categoryId, navigate],
  );
  const timeDistance = formatDistanceStrict(Date.parse(created), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[i18n.language],
    roundingMethod: "floor",
  });

  const followSwitch = useMemo(
    () => (
      <SwitchRoot checked={!!topic?.isFollowing} onCheckedChange={onFollowChange}>
        <SwitchLabel>{t("myNdla.arena.posts.notify")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
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
              <Content textStyle="body.medium">{parse(contentAsHTML!)}</Content>
            </ContentWrapper>
            <FlexLine>
              <Text textStyle="body.small">
                <span title={formatDateTime(created, i18n.language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
              </Text>
              <FlexLine>
                <VotePost post={post} />
                <PostAction
                  topic={topic}
                  post={post}
                  type={"topic"}
                  setFocusId={setFocusId}
                  setIsEditing={setIsEditing}
                  onDelete={deleteTopicCallback}
                />
                <Button
                  variant="primary"
                  size="small"
                  ref={replyToRef}
                  onClick={setReplyingTo}
                  disabled={isReplying || topic?.isLocked}
                >
                  {t("myNdla.arena.new.post")}
                </Button>
              </FlexLine>
            </FlexLine>
          </>
        )}
      </PostCardWrapper>
    </PostWrapper>
  );
};

export default MainPostCard;
