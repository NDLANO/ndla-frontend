/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import parse from "html-react-parser";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reply } from "@ndla/icons/action";
import { IconButton, Text } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { ReplyDialog } from "./ReplyDialog";
import { useArenaDeletePost, useArenaUpdatePost } from "./temporaryNodebbHooks";
import VotePost from "./VotePost";
import { useToast } from "../../../../components/ToastContext";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { useUserAgent } from "../../../../UserAgentContext";
import { formatDateTime } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

const PostCardWrapper = styled("div", {
  base: {
    backgroundColor: "surface.default",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
  },
});

interface Props {
  post: Omit<GQLArenaPostV2Fragment, "replies">;
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setIsReplying: VoidFunction;
  nextPostId: number;
  isRoot?: boolean;
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  isReplyingTo?: number;
}

const PostCard = ({ nextPostId, post, topic, setFocusId, setIsReplying, isReplyingTo, isRoot }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML } = post;
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const userAgent = useUserAgent();
  const { updatePost } = useArenaUpdatePost(topicId);
  const { deletePost } = useArenaDeletePost(topicId);

  const deletePostCallback = useCallback(
    async (close: VoidFunction) => {
      await deletePost({ variables: { postId } });
      close();
      toast.create({
        title: t("myNdla.arena.deleted.post"),
      });
      setFocusId?.(nextPostId);
    },
    [deletePost, postId, toast, t, setFocusId, nextPostId],
  );

  const timeDistance = formatDistanceStrict(Date.parse(created), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[i18n.language],
    roundingMethod: "floor",
  });

  const postTime = useMemo(
    () => (
      <Text textStyle="body.small" asChild consumeCss>
        <span title={formatDateTime(created, i18n.language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
      </Text>
    ),
    [created, i18n.language, timeDistance],
  );
  const postUpvotes = useMemo(() => <VotePost post={post} />, [post]);

  const menu = useMemo(
    () => (
      <PostAction
        post={post}
        type="post"
        setFocusId={setFocusId}
        setIsEditing={setIsEditing}
        onDelete={deletePostCallback}
      />
    ),
    [post, setFocusId, deletePostCallback],
  );

  const replyButton = useMemo(
    () =>
      isRoot && !topic?.isLocked ? (
        userAgent?.isMobile ? (
          <ReplyDialog formType="post" topicId={post.topicId} postId={post.id}>
            <IconButton
              variant="tertiary"
              title={t("myNdla.arena.posts.reply", { name: post.owner?.username })}
              aria-label={t("myNdla.arena.posts.reply", { name: post.owner?.username })}
            >
              <Reply />
            </IconButton>
          </ReplyDialog>
        ) : (
          <IconButton
            variant="tertiary"
            title={t("myNdla.arena.posts.reply", { name: post.owner?.username })}
            aria-label={t("myNdla.arena.posts.reply", { name: post.owner?.username })}
            onClick={setIsReplying}
            aria-expanded={isReplyingTo === post.id}
            aria-controls={`reply-form-${postId}`}
          >
            <Reply />
          </IconButton>
        )
      ) : null,
    [
      isRoot,
      post.id,
      post.owner?.username,
      post.topicId,
      postId,
      isReplyingTo,
      setIsReplying,
      t,
      topic?.isLocked,
      userAgent?.isMobile,
    ],
  );

  const options = useMemo(
    () => (
      <HStack justify="space-between">
        {postTime}
        <HStack gap="medium">
          {postUpvotes}
          <HStack gap="3xsmall">
            {replyButton}
            {menu}
          </HStack>
        </HStack>
      </HStack>
    ),
    [menu, postTime, postUpvotes, replyButton],
  );

  return (
    <PostCardWrapper id={`post-${postId}`}>
      {isEditing ? (
        <ArenaForm
          id={postId}
          type="post"
          initialContent={post.content}
          onAbort={() => setIsEditing(false)}
          onSave={async (values) => {
            await updatePost({
              variables: { postId, content: values.content ?? "" },
            });
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <UserProfileTag user={post.owner} />
          <Text asChild consumeCss>
            <div>{parse(contentAsHTML!)}</div>
          </Text>
          {options}
        </>
      )}
    </PostCardWrapper>
  );
};

export default PostCard;
