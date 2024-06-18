/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, TrashCanOutline } from "@ndla/icons/action";
import { ReportOutlined, Locked } from "@ndla/icons/common";
import FlagPostModalContent from "./FlagPostModalContent";
import LockModal from "./LockModal";
import { compareUsernames } from "./PostCard";
import { AuthContext } from "../../../../components/AuthenticationContext";
import config from "../../../../config";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import DeleteModalContent from "../../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";

interface PostActionProps {
  post: GQLArenaPostV2Fragment | Omit<GQLArenaPostV2Fragment, "replies">;
  type: "topic" | "post";
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onDelete: ((close: () => void, autoFocus: () => void) => void) | ((close: () => void) => void);
  topic?: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
}

export const PostAction = ({ post, topic, type, setIsEditing, onDelete }: PostActionProps) => {
  const { id: postId, owner } = post;
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

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
        onDelete={() => onDelete(close, skipAutoFocus)}
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

  return <SettingsMenu menuItems={menuItems} />;
};
