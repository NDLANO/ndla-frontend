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
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing, misc } from "@ndla/core";
import { Back } from "@ndla/icons/common";
import { Text } from "@ndla/typography";
import { useSnack } from "@ndla/ui";
import ArenaForm from "./ArenaForm";
import { PostAction } from "./PostAction";
import { useArenaDeletePost, useArenaUpdatePost } from "./temporaryNodebbHooks";
import config from "../../../../config";
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
  gap: ${spacing.normal};
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

export const compareUsernames = (userUsername?: string, postUsername?: string) => {
  if (!userUsername || !postUsername) return false;

  if (config.enableNodeBB) {
    // Nodebb usernames cannot contain every character so we need to replace them :^)
    const nodebbUsername = userUsername?.replace(/[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/, "-");
    return nodebbUsername === postUsername;
  }

  return userUsername === postUsername;
};
interface Props {
  post: Omit<GQLArenaPostV2Fragment, "replies">;
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setIsReplying: VoidFunction;
  nextPostId: number;
}

const PostCard = ({ nextPostId, post, setFocusId, setIsReplying }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML } = post;
  const { addSnack } = useSnack();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { updatePost } = useArenaUpdatePost(topicId);
  const { deletePost } = useArenaDeletePost(topicId);

  const deletePostCallback = useCallback(
    async (close: VoidFunction, skipAutoFocus: VoidFunction) => {
      await deletePost({ variables: { postId } });
      close();
      addSnack({
        content: t("myNdla.arena.deleted.post"),
        id: "arenaPostDeleted",
      });
      setFocusId?.(nextPostId);
      skipAutoFocus();
    },
    [deletePost, postId, addSnack, t, setFocusId, nextPostId],
  );
  const timeDistance = formatDistanceStrict(Date.parse(created), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[language],
    roundingMethod: "floor",
  });

  const postTime = useMemo(
    () => (
      <TimestampText element="span" textStyle="content-alt" margin="none">
        <span title={formatDateTime(created, language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
      </TimestampText>
    ),
    [created, language, timeDistance],
  );

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

  const options = useMemo(
    () => (
      <>
        {postTime}
        <div>
          <IconButtonV2 variant="ghost" colorTheme="light" size="small" aria-label="Svar" onClick={setIsReplying}>
            <Back />
          </IconButtonV2>
          {menu}
        </div>
      </>
    ),
    [menu, postTime, setIsReplying],
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
            <FlexLine>{options}</FlexLine>
          </>
        )}
      </PostCardWrapper>
    </PostWrapper>
  );
};

export default PostCard;
