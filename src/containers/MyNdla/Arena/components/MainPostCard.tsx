/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import parse from "html-react-parser";
import { Dispatch, SetStateAction, useState, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
  Heading,
  Button,
} from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { ReplyDialog } from "./ReplyDialog";
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

const MainPostCardWrapper = styled("div", {
  base: {
    backgroundColor: "surface.infoSubtle",
    borderTopRadius: "xsmall",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const PostHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "small",
  },
});

const Content = styled(Text, {
  base: {
    wordBreak: "break-word",
    "& ul, & ol": {
      paddingInlineStart: "medium",
    },
  },
});

const StyledBottomRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "xsmall",
  },
});

const ActionsWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "medium",
    marginInlineStart: "auto",
  },
});

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
  const userAgent = useUserAgent();
  const { updateTopic } = useArenaUpdateTopic(topicId);
  const { deleteTopic } = useArenaDeleteTopic(topic?.categoryId);
  const toast = useToast();
  const navigate = useNavigate();

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

  return (
    <MainPostCardWrapper id={`post-${postId}`}>
      {isEditing ? (
        <ArenaForm
          id={postId}
          type="topic"
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
          <PostHeader>
            {profileTag}
            {followSwitch}
          </PostHeader>
          <Stack gap="xsmall">
            <Heading id={SKIP_TO_CONTENT_ID} textStyle="title.large" fontWeight="bold">
              {topic?.title}
            </Heading>
            <Content textStyle="body.large" asChild consumeCss>
              <div>{parse(contentAsHTML!)}</div>
            </Content>
          </Stack>
          <StyledBottomRow>
            <Text textStyle="body.small" asChild consumeCss>
              <span title={formatDateTime(created, i18n.language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
            </Text>
            <ActionsWrapper>
              <VotePost post={post} />
              <PostAction
                topic={topic}
                post={post}
                type="topic"
                setFocusId={setFocusId}
                setIsEditing={setIsEditing}
                onDelete={deleteTopicCallback}
              />
              {userAgent?.isMobile ? (
                <ReplyDialog formType="post" topicId={topicId} ref={replyToRef}>
                  <Button variant="primary" disabled={topic?.isLocked}>
                    {t("myNdla.arena.new.post")}
                  </Button>
                </ReplyDialog>
              ) : (
                <Button
                  variant="primary"
                  ref={replyToRef}
                  onClick={setReplyingTo}
                  disabled={isReplying || topic?.isLocked}
                  aria-controls={`reply-form-${topicId}`}
                  aria-expanded={!!isReplying}
                >
                  {t("myNdla.arena.new.post")}
                </Button>
              )}
            </ActionsWrapper>
          </StyledBottomRow>
        </>
      )}
    </MainPostCardWrapper>
  );
};

export default MainPostCard;
