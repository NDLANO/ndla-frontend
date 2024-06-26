/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import parse from "html-react-parser";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { colors, spacing, misc, mq, breakpoints } from "@ndla/core";
import { Pencil, Thumb, ThumbFilled, TrashCanOutline } from "@ndla/icons/action";
import { ReportOutlined, Locked } from "@ndla/icons/common";
import { Switch } from "@ndla/switch";
import { Text, Heading } from "@ndla/typography";
import { useSnack } from "@ndla/ui";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./ArenaForm";
import FlagPostModalContent from "./FlagPostModalContent";
import LockModal from "./LockModal";
import {
  useArenaDeletePost,
  useArenaDeleteTopic,
  useArenaPostRemoveUpvote,
  useArenaPostUpvote,
  useArenaUpdatePost,
  useArenaUpdateTopic,
} from "./temporaryNodebbHooks";
import { AuthContext } from "../../../../components/AuthenticationContext";
import config from "../../../../config";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { routes } from "../../../../routeHelpers";
import { useUserAgent } from "../../../../UserAgentContext";
import { formatDateTime } from "../../../../util/formatDate";
import DeleteModalContent from "../../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  onFollowChange: (value: boolean) => void;
  post: GQLArenaPostV2Fragment;
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  isMainPost: boolean;
  createReply: (data: Partial<ArenaFormValues>) => void;
}

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.large};
`;

const StyledArenaFormWrapper = styled(ArenaFormWrapper)`
  ${mq.range({ from: breakpoints.tablet })} {
    margin-left: ${spacing.xlarge};
  }
`;

const PostCardWrapper = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const FlexLine = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
`;

const TimestampText = styled(Text)`
  align-self: center;
`;

const Content = styled(Text)`
  ul,
  ol {
    padding-left: ${spacing.normal};
  }
  word-break: break-word;
`;

export const compareUsernames = (userUsername: string | undefined, postUsername: string | undefined) => {
  if (!userUsername || !postUsername) return false;

  if (config.enableNodeBB) {
    // Nodebb usernames cannot contain every character so we need to replace them :^)
    const nodebbUsername = userUsername?.replace(/[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/, "-");
    return nodebbUsername === postUsername;
  }

  return userUsername === postUsername;
};

const PostCard = ({ topic, post, onFollowChange, setFocusId, isMainPost, createReply }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { id: postId, topicId, created, contentAsHTML, owner } = post;
  const replyToRef = useRef<HTMLButtonElement | null>(null);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const { addSnack } = useSnack();
  const { user } = useContext(AuthContext);
  const { updatePost } = useArenaUpdatePost(topicId);
  const { updateTopic } = useArenaUpdateTopic(topicId);
  const { deletePost } = useArenaDeletePost(topicId);
  const { deleteTopic } = useArenaDeleteTopic(topic?.categoryId);
  const [upvote] = useArenaPostUpvote(topicId);
  const [removeUpvote] = useArenaPostRemoveUpvote(topicId);
  const selectors = useUserAgent();

  const type = isMainPost ? "topic" : "post";

  const validPosts = useMemo(() => topic?.posts, [topic?.posts]);

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

  const deletePostCallback = useCallback(
    async (close: VoidFunction, skipAutoFocus: VoidFunction) => {
      await deletePost({ variables: { postId } });
      close();
      addSnack({
        content: t("myNdla.arena.deleted.post"),
        id: "arenaPostDeleted",
      });
      const index = validPosts?.items?.indexOf(post) ?? 0;
      const previousPostId = validPosts?.items?.[index - 1]?.id;
      const nextPostId = validPosts?.items?.[index + 1]?.id;
      setFocusId(nextPostId ?? previousPostId);
      skipAutoFocus();
    },
    [deletePost, postId, addSnack, t, setFocusId, validPosts, post],
  );

  const menu = useMemo(() => {
    const isOwnPost = compareUsernames(user?.username, owner?.username);
    const disableModification = topic?.isLocked && !user?.isModerator;

    const update: MenuItemProps = {
      icon: <Pencil />,
      text: t("myNdla.arena.posts.dropdownMenu.edit"),
      type: "primary",
      disabled: disableModification,
      onClick: () => setIsEditing(true),
    };

    const deleteItem: MenuItemProps = {
      icon: <TrashCanOutline />,
      type: "danger",
      text: t("myNdla.arena.posts.dropdownMenu.delete"),
      isModal: true,
      disabled: disableModification,
      modalContent: (close, skipAutoFocus) => (
        <DeleteModalContent
          onClose={close}
          onDelete={async () => {
            isMainPost ? await deleteTopicCallback(close) : await deletePostCallback(close, skipAutoFocus);
          }}
          title={t(`myNdla.arena.deleteTitle.${type}`)}
          description={t(`myNdla.arena.description.${type}`)}
          removeText={t(`myNdla.arena.removeText.${type}`)}
        />
      ),
    };

    const report: MenuItemProps = {
      icon: <ReportOutlined />,
      text: t("myNdla.arena.posts.dropdownMenu.report"),
      type: "primary",
      isModal: true,
      modality: false,
      modalContent: (close) => <FlagPostModalContent id={postId} onClose={close} />,
    };

    const lockUnlock: MenuItemProps = {
      icon: <Locked />,
      text: topic?.isLocked ? t("myNdla.arena.topic.unlock") : t("myNdla.arena.topic.locked"),
      type: "danger",
      isModal: true,
      modalContent: (close) => <LockModal topic={topic} post={post} onClose={close} />,
    };

    const menuItems: MenuItemProps[] = [];
    if (user?.isModerator) {
      menuItems.push(deleteItem);
      if (type === "topic" && !config.enableNodeBB) menuItems.push(lockUnlock);

      menuItems.push(update);
      menuItems.push(report);
    } else if (isOwnPost) {
      menuItems.push(deleteItem);
      menuItems.push(update);
    } else {
      menuItems.push(report);
    }

    return <SettingsMenu menuItems={menuItems} modalHeader={t("myNdla.tools")} />;
  }, [
    user?.username,
    user?.isModerator,
    owner?.username,
    topic,
    t,
    type,
    isMainPost,
    deleteTopicCallback,
    deletePostCallback,
    postId,
    post,
  ]);

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

  const postUpvotes = useMemo(
    () => (
      <>
        {post.owner?.id !== user?.id && (
          <IconButtonV2
            aria-label={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
            title={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
            variant="ghost"
            colorTheme="light"
            onClick={() =>
              post.upvoted
                ? removeUpvote({ variables: { postId: post.id } })
                : upvote({ variables: { postId: post.id } })
            }
          >
            {post.upvoted ? <ThumbFilled /> : <Thumb />}
          </IconButtonV2>
        )}
        <TimestampText
          element="span"
          textStyle="content-alt"
          margin="none"
          aria-label={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
          title={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
        >
          <span aria-hidden>{post.upvotes ?? 0}</span>
        </TimestampText>
      </>
    ),
    [post.id, post.owner?.id, post.upvoted, post.upvotes, removeUpvote, t, upvote, user?.id],
  );

  const options = useMemo(
    () =>
      isMainPost ? (
        <>
          {postTime}
          <FlexLine>
            {postUpvotes}
            {menu}
            <ButtonV2 ref={replyToRef} onClick={() => setIsReplying(true)} disabled={isReplying || topic?.isLocked}>
              {t("myNdla.arena.new.post")}
            </ButtonV2>
          </FlexLine>
        </>
      ) : (
        <>
          {postTime}
          <FlexLine>
            {postUpvotes}
            {menu}
          </FlexLine>
        </>
      ),
    [menu, isMainPost, t, postTime, postUpvotes, replyToRef, setIsReplying, isReplying, topic?.isLocked],
  );

  const followSwitch = useMemo(
    () =>
      isMainPost ? (
        <StyledSwitch
          onChange={onFollowChange}
          checked={!!topic?.isFollowing}
          label={t("myNdla.arena.posts.notify")}
          id={t("myNdla.arena.posts.notify")}
        />
      ) : null,
    [onFollowChange, topic?.isFollowing, isMainPost, t],
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
            type={type}
            initialTitle={topic?.title}
            initialLocked={topic?.isLocked}
            initialContent={post.content}
            onAbort={() => setIsEditing(false)}
            onSave={async (values) => {
              if (isMainPost) {
                await updateTopic({
                  variables: {
                    topicId,
                    title: values.title ?? "",
                    content: values.content ?? "",
                    isLocked: values.locked ?? false,
                  },
                });
              } else {
                await updatePost({
                  variables: { postId, content: values.content ?? "" },
                });
              }
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <PostHeader>{header}</PostHeader>
            <ContentWrapper>
              {isMainPost && (
                <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h4" margin="none">
                  {topic?.title}
                </Heading>
              )}
              <Content element="div" textStyle="content-alt" margin="none">
                {parse(contentAsHTML!)}
              </Content>
            </ContentWrapper>
            <FlexLine>{options}</FlexLine>
          </>
        )}
      </PostCardWrapper>
      {isReplying && (
        <StyledArenaFormWrapper>
          <ArenaForm
            onAbort={async () => {
              setIsReplying(false);
              setTimeout(() => replyToRef.current?.focus(), 1);
            }}
            type="post"
            onSave={async (values) => {
              await createReply(values);
              setIsReplying(false);
            }}
          />
        </StyledArenaFormWrapper>
      )}
    </PostWrapper>
  );
};

export default PostCard;
