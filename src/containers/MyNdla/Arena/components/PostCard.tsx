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
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { Reply } from "@ndla/icons/action";
import { IconButton } from "@ndla/primitives";
import { Text } from "@ndla/typography";
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

export const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

export const PostCardWrapper = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
  margin-bottom: ${spacing.normal};
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

export const FlexLine = styled.div`
  display: flex;
  gap: ${spacing.nsmall};
  justify-content: space-between;
`;

export const TimestampText = styled(Text)`
  align-self: center;
`;

export const Content = styled(Text)`
  ul,
  ol {
    padding-left: ${spacing.normal};
  }
  word-break: break-word;
`;

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
      <TimestampText element="span" textStyle="content-alt" margin="none">
        <span title={formatDateTime(created, i18n.language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
      </TimestampText>
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
    <PostWrapper>
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
              <Content element="div" textStyle="content-alt" margin="none">
                {parse(contentAsHTML!)}
              </Content>
            </ContentWrapper>
            {options}
          </>
        )}
      </PostCardWrapper>
    </PostWrapper>
  );
};

export default PostCard;
