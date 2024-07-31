/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useContext, useRef, useCallback, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import styled from "@emotion/styled";
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
import { OutletContext } from "../../MyNdlaLayout";
import { isStudent, copyFolderSharingLink } from "../util";

interface FolderButtonProps {
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  selectedFolder: GQLFolder | null;
}

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
`;

const FolderButtons = ({ setFocusId, selectedFolder }: FolderButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { folderId } = useParams();
  const toast = useToast();
  const { examLock, user } = useContext(AuthContext);
  const { setResetFocus, setIsOpen } = useOutletContext<OutletContext>();

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
      setIsOpen(false);
      setResetFocus(true);
    },
    [toast, t, setFocusId, setIsOpen, setResetFocus],
  );

  const onFolderUpdated = useCallback(() => {
    toast.create({ title: t("myNdla.folder.updated") });
    setIsOpen(false);
  }, [toast, t, setIsOpen]);

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
    setResetFocus(true);
    setIsOpen(false);
    setPreventDefault(true);
  }, [selectedFolder, deleteFolder, folderId, toast, t, setResetFocus, setIsOpen, navigate]);

  const showAddButton = (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
  const showShareFolder = folderId !== null && !isStudent(user);
  const isFolderShared = selectedFolder?.status !== "private";

  const unShareButton =
    selectedFolder && isFolderShared ? (
      <StyledListItem key="unShareFolderButton">
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
      </StyledListItem>
    ) : null;

  const shareButton = selectedFolder ? (
    <FolderShareModal
      key="shareFolderButton"
      folder={selectedFolder}
      setRef={() => setTimeout(() => shareRef.current?.focus(), 0)}
      onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
    >
      <StyledListItem key="shareFolderButton">
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
      </StyledListItem>
    </FolderShareModal>
  ) : null;

  const addFolderButton = showAddButton ? (
    <StyledListItem key="createFolderButton">
      <FolderCreateModal key="createFolderButton" onSaved={onFolderAdded} parentFolder={selectedFolder} />
    </StyledListItem>
  ) : null;

  const editFolderButton = selectedFolder ? (
    <StyledListItem key="editFolderButton">
      <FolderEditModal key="editFolderButton" onSaved={onFolderUpdated} folder={selectedFolder} />
    </StyledListItem>
  ) : null;

  const deleteFolderButton = selectedFolder?.id ? (
    <StyledListItem key="deleteFolderButton">
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
    </StyledListItem>
  ) : null;

  const copySharedFolderLink =
    selectedFolder && isFolderShared ? (
      <StyledListItem key="copySharedLink">
        <Button
          key="copySharedLink"
          variant="tertiary"
          onClick={() => {
            copyFolderSharingLink(selectedFolder.id);
            toast.create({
              title: t("myNdla.folder.sharing.link"),
            });
            setIsOpen(false);
          }}
          aria-label={t("myNdla.folder.sharing.button.shareLink")}
          title={t("myNdla.folder.sharing.button.shareLink")}
        >
          <FileCopyLine size="small" />
          {t("myNdla.folder.sharing.button.shareLink")}
        </Button>
      </StyledListItem>
    ) : null;

  const previewFolderButton =
    selectedFolder && isFolderShared ? (
      <StyledListItem key="previewFolder">
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
      </StyledListItem>
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
