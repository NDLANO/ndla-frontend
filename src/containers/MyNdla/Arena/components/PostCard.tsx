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
import { styled } from "@ndla/styled-system/jsx";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { useArenaDeletePost, useArenaUpdatePost } from "./temporaryNodebbHooks";
import VotePost from "./VotePost";
import { useToast } from "../../../../components/ToastContext";
import { GQLArenaPostV2Fragment } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { formatDateTime } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

export const PostCardWrapper = styled("div", {
  base: {
    backgroundColor: "surface.default",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    borderBottom: "1px solid",
    borderColor: "icon.subtle",
  },
});

export const PostHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

export const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

export const FlexLine = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: "small",
    justifyContent: "space-between",
  },
});

export const Content = styled(Text, {
  base: {
    wordBreak: "break-word",
    "& ul, & ol": {
      paddingInlineStart: "medium",
    },
  },
});

interface Props {
  post: Omit<GQLArenaPostV2Fragment, "replies">;
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setIsReplying: VoidFunction;
  nextPostId: number;
  isRoot?: boolean;
}

const PostCard = ({ nextPostId, post, setFocusId, setIsReplying, isRoot }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML } = post;
  const toast = useToast();
  const { t, i18n } = useTranslation();
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
        type={"post"}
        setFocusId={setFocusId}
        setIsEditing={setIsEditing}
        onDelete={deletePostCallback}
      />
    ),
    [post, setFocusId, deletePostCallback],
  );

  const replyButton = useMemo(
    () =>
      isRoot ? (
        <IconButton
          variant="tertiary"
          aria-label={t("myNdla.arena.posts.reply", { name: post.owner?.username })}
          onClick={setIsReplying}
        >
          <Reply />
        </IconButton>
      ) : null,
    [setIsReplying, isRoot, t, post.owner?.username],
  );

  const options = useMemo(
    () => (
      <FlexLine>
        {postTime}
        <FlexLine>
          {postUpvotes}
          {replyButton}
          {menu}
        </FlexLine>
      </FlexLine>
    ),
    [menu, postTime, postUpvotes, replyButton],
  );

  return (
    <PostCardWrapper id={`post-${postId}`}>
      {isEditing ? (
        <ArenaForm
          id={postId}
          type={"post"}
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
          <PostHeader>
            <UserProfileTag user={post.owner} />
          </PostHeader>
          <ContentWrapper>
            <Content textStyle="body.medium">{parse(contentAsHTML!)}</Content>
          </ContentWrapper>
          {options}
        </>
      )}
    </PostCardWrapper>
  );
};

export default PostCard;
