/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, PencilLine } from "@ndla/icons/action";
import { SpamLine, LockLine } from "@ndla/icons/common";
import { ArenaFormValues } from "./ArenaForm";
import FlagPostModalContent from "./FlagPostModalContent";
import LockModal from "./LockModal";
import { ReplyDialogContent } from "./ReplyDialog";
import { useArenaUpdatePost, useArenaUpdateTopic } from "./temporaryNodebbHooks";
import { AuthContext } from "../../../../components/AuthenticationContext";
import config from "../../../../config";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { useUserAgent } from "../../../../UserAgentContext";
import DeleteModalContent from "../../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";

export const compareUsernames = (userUsername?: string, postUsername?: string) => {
  if (!userUsername || !postUsername) return false;

  if (config.enableNodeBB) {
    // Nodebb usernames cannot contain every character so we need to replace them :^)
    const nodebbUsername = userUsername?.replace(/[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/, "-");
    return nodebbUsername === postUsername;
  }

  return userUsername === postUsername;
};

interface PostActionProps {
  post: GQLArenaPostV2Fragment | Omit<GQLArenaPostV2Fragment, "replies">;
  type: "topic" | "post";
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onDelete: (close: () => void) => void;
  topic?: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
}

export const PostAction = ({ post, topic, type, setIsEditing, onDelete }: PostActionProps) => {
  const { id: postId, owner } = post;
  const { t } = useTranslation();
  const userAgent = useUserAgent();
  const { user } = useContext(AuthContext);
  const { updateTopic } = useArenaUpdateTopic(post.topicId);
  const { updatePost } = useArenaUpdatePost(postId);

  const isOwnPost = compareUsernames(user?.username, owner?.username);
  const disableModification = topic?.isLocked && !user?.isModerator;

  const saveTopic = useCallback(
    async (value: Partial<ArenaFormValues>) => {
      await updateTopic({
        variables: {
          topicId: post.topicId,
          title: value.title ?? "",
          content: value.content ?? "",
        },
      });
    },
    [updateTopic, post.topicId],
  );

  const savePost = useCallback(
    async (value: Partial<ArenaFormValues>) => {
      await updatePost({
        variables: {
          postId: postId,
          content: value.content ?? "",
        },
      });
    },
    [postId, updatePost],
  );

  const update = useMemo(() => {
    const updateBase: Omit<MenuItemProps, "type"> = {
      value: "editPost",
      icon: <PencilLine />,
      text: t("myNdla.arena.posts.dropdownMenu.edit"),
      disabled: disableModification,
    };

    const updateMobile: MenuItemProps = {
      ...updateBase,
      type: "dialog",
      modalContent: (close) => (
        <ReplyDialogContent type={type} onSave={type === "post" ? savePost : saveTopic} onAbort={close} />
      ),
    };

    const updateDefault: MenuItemProps = {
      ...updateBase,
      type: "action",
      onClick: () => setIsEditing(true),
    };

    return userAgent?.isMobile ? updateMobile : updateDefault;
  }, [disableModification, savePost, saveTopic, setIsEditing, t, type, userAgent?.isMobile]);

  const deleteItem: MenuItemProps = {
    type: "dialog",
    value: "deletePost",
    icon: <DeleteBinLine />,
    variant: "destructive",
    text: t("myNdla.arena.posts.dropdownMenu.delete"),
    disabled: disableModification,
    modalContent: (close) => (
      <DeleteModalContent
        onClose={close}
        onDelete={() => onDelete(close)}
        title={t(`myNdla.arena.deleteTitle.${type}`)}
        description={t(`myNdla.arena.description.${type}`)}
        removeText={t(`myNdla.arena.removeText.${type}`)}
      />
    ),
  };

  const report: MenuItemProps = {
    type: "dialog",
    value: "reportPost",
    icon: <SpamLine />,
    text: t("myNdla.arena.posts.dropdownMenu.report"),
    modalContent: (close) => <FlagPostModalContent id={postId} onClose={close} />,
  };

  const lockUnlock: MenuItemProps = {
    type: "dialog",
    value: "lockPost",
    icon: <LockLine />,
    text: topic?.isLocked ? t("myNdla.arena.topic.unlock") : t("myNdla.arena.topic.locked"),
    variant: "destructive",
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

  return <SettingsMenu menuItems={menuItems} />;
};
