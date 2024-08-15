/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useContext, useRef, useCallback, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDialogContext } from "@ark-ui/react";
import { CloseLine, FileCopyLine } from "@ndla/icons/action";
import { ShareFill, ShareArrow } from "@ndla/icons/common";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import FolderCreateModal from "./FolderCreateModal";
import FolderDeleteModal from "./FolderDeleteModal";
import FolderEditModal from "./FolderEditModal";
import FolderShareModal from "./FolderShareModal";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { useToast } from "../../../../components/ToastContext";
import { GQLFolder } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { useUpdateFolderStatusMutation, useDeleteFolderMutation } from "../../folderMutations";
import { isStudent, copyFolderSharingLink } from "../util";

interface FolderButtonProps {
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  selectedFolder: GQLFolder | null;
}

const FolderButtons = ({ setFocusId, selectedFolder }: FolderButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { folderId } = useParams();
  const toast = useToast();
  const { examLock, user } = useContext(AuthContext);
  const { setOpen } = useDialogContext();

  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);

  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { deleteFolder } = useDeleteFolderMutation();

  const [preventDefault, setPreventDefault] = useState(false);

  const onFolderAdded = useCallback(
    (folder?: GQLFolder) => {
      if (!folder) {
        return;
      }
      toast.create({
        title: t("myNdla.folder.folderCreated", {
          folderName: folder.name,
        }),
      });
      setFocusId(folder.id);
      setOpen(false);
    },
    [toast, t, setFocusId, setOpen],
  );

  const onFolderUpdated = useCallback(() => {
    toast.create({ title: t("myNdla.folder.updated") });
    setOpen(false);
  }, [toast, t, setOpen]);

  const onDeleteFolder = useCallback(async () => {
    if (!selectedFolder) {
      return;
    }

    await deleteFolder({ variables: { id: selectedFolder.id } });
    if (selectedFolder.id === folderId) {
      navigate(routes.myNdla.folder(selectedFolder.parentId ?? ""), {
        replace: true,
      });
    }
    toast.create({
      title: t("myNdla.folder.folderDeleted", {
        folderName: selectedFolder.name,
      }),
    });
    setOpen(false);
    setPreventDefault(true);
  }, [selectedFolder, deleteFolder, folderId, toast, t, setOpen, navigate]);

  const showAddButton = (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
  const showShareFolder = folderId !== null && !isStudent(user);
  const isFolderShared = selectedFolder?.status !== "private";

  const unShareButton =
    selectedFolder && isFolderShared ? (
      <li key="unShareFolderButton">
        <Button
          variant="tertiary"
          ref={unShareRef}
          aria-label={t("myNdla.folder.sharing.button.unShare")}
          title={t("myNdla.folder.sharing.button.unShare")}
          onClick={async () => {
            updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: "private",
              },
            }).then(() => setTimeout(() => shareRef.current?.focus(), 0));
            toast.create({
              title: t("myNdla.folder.sharing.unShare"),
            });
          }}
        >
          <CloseLine size="small" />
          {t("myNdla.folder.sharing.button.unShare")}
        </Button>
      </li>
    ) : null;

  const shareButton = selectedFolder ? (
    <li key="shareFolderButton">
      <FolderShareModal
        key="shareFolderButton"
        folder={selectedFolder}
        onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
      >
        <Button
          variant="tertiary"
          ref={shareRef}
          aria-label={t("myNdla.folder.sharing.share")}
          title={t("myNdla.folder.sharing.share")}
          onClick={async () => {
            !isFolderShared &&
              updateFolderStatus({
                variables: {
                  folderId: selectedFolder.id,
                  status: "shared",
                },
              });
            !isFolderShared &&
              toast.create({
                title: t("myNdla.folder.sharing.header.shared"),
              });
          }}
        >
          <ShareFill size="small" />
          {t("myNdla.folder.sharing.button.shareShort")}
        </Button>
      </FolderShareModal>
    </li>
  ) : null;

  const addFolderButton = showAddButton ? (
    <li key="createFolderButton">
      <FolderCreateModal key="createFolderButton" onSaved={onFolderAdded} parentFolder={selectedFolder} />
    </li>
  ) : null;

  const editFolderButton = selectedFolder ? (
    <li key="editFolderButton">
      <FolderEditModal key="editFolderButton" onSaved={onFolderUpdated} folder={selectedFolder} />
    </li>
  ) : null;

  const deleteFolderButton = selectedFolder?.id ? (
    <li key="deleteFolderButton">
      <FolderDeleteModal
        key="deleteFolderButton"
        onDelete={onDeleteFolder}
        onClose={(e) => {
          if (preventDefault) {
            e?.preventDefault();
            document.getElementById("titleAnnouncer")?.focus();
            setPreventDefault(false);
          }
        }}
      />
    </li>
  ) : null;

  const copySharedFolderLink =
    selectedFolder && isFolderShared ? (
      <li key="copySharedLink">
        <Button
          key="copySharedLink"
          variant="tertiary"
          onClick={() => {
            copyFolderSharingLink(selectedFolder.id);
            toast.create({
              title: t("myNdla.folder.sharing.link"),
            });
            setOpen(false);
          }}
          aria-label={t("myNdla.folder.sharing.button.shareLink")}
          title={t("myNdla.folder.sharing.button.shareLink")}
        >
          <FileCopyLine size="small" />
          {t("myNdla.folder.sharing.button.shareLink")}
        </Button>
      </li>
    ) : null;

  const previewFolderButton =
    selectedFolder && isFolderShared ? (
      <li key="previewFolder">
        <SafeLinkButton
          key="previewFolder"
          variant="tertiary"
          to={routes.folder(selectedFolder.id)}
          aria-label={t("myNdla.folder.sharing.button.goTo")}
          title={t("myNdla.folder.sharing.button.goTo")}
        >
          <ShareArrow size="small" />
          {t("myNdla.folder.sharing.button.goTo")}
        </SafeLinkButton>
      </li>
    ) : null;

  if (!showShareFolder) {
    const buttons = [addFolderButton, editFolderButton, deleteFolderButton];
    return buttons;
  }
  const buttons = [
    addFolderButton,
    editFolderButton,
    shareButton,
    previewFolderButton,
    copySharedFolderLink,
    unShareButton,
    deleteFolderButton,
  ];
  return buttons;
};

export default memo(FolderButtons);
