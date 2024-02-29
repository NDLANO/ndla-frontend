/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Cross, Pencil, Plus } from "@ndla/icons/action";
import { Link, Share, ShareArrow } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { useSnack } from "@ndla/ui";
import { CreateModalContent } from "./FolderCreateModal";
import { EditFolderModalContent } from "./FolderEditModal";
import { FolderFormValues } from "./FolderForm";
import { FolderShareModalContent } from "./FolderShareModal";
import { copyFolderSharingLink, isStudent } from "./util";
import { AuthContext } from "../../../components/AuthenticationContext";
import config from "../../../config";
import { GQLFolder } from "../../../graphqlTypes";
import { myNdlaRoutes } from "../../../routeHelpers";
import DeleteModalContent from "../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../components/SettingsMenu";
import { useAddFolderMutation, useDeleteFolderMutation, useUpdateFolderStatusMutation } from "../folderMutations";

interface Props {
  selectedFolder: GQLFolder | null;
  folderRefId?: string;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  inToolbar?: boolean;
  folders: GQLFolder[];
}

const FolderActions = ({ selectedFolder, setFocusId, folders, inToolbar = false, folderRefId }: Props) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const { folderId } = useParams();
  const navigate = useNavigate();

  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { deleteFolder } = useDeleteFolderMutation();
  const { addFolder } = useAddFolderMutation();

  const { user, examLock } = useContext(AuthContext);

  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);

  const onFolderUpdated = useCallback(() => {
    addSnack({ id: "folderUpdated", content: t("myNdla.folder.updated") });
  }, [addSnack, t]);

  const onFolderAdded = useCallback(
    async (values: FolderFormValues) => {
      const res = await addFolder({
        variables: {
          name: values.name,
          description: values.description,
          parentId: inToolbar ? folderId : selectedFolder?.parentId ?? undefined,
        },
      });
      const folder = res.data?.addFolder as GQLFolder | undefined;

      if (folder) {
        addSnack({
          id: "folderAdded",
          content: t("myNdla.folder.folderCreated", {
            folderName: folder.name,
          }),
        });
        setFocusId(folder.id);
      }
    },
    [selectedFolder?.parentId, setFocusId, inToolbar, addFolder, addSnack, folderId, t],
  );

  const onDeleteFolder = useCallback(async () => {
    if (!selectedFolder) return;

    await deleteFolder({ variables: { id: selectedFolder.id } });

    if (selectedFolder?.id === folderId) {
      navigate(myNdlaRoutes.myNdlaFolder(selectedFolder?.parentId ?? ""), {
        replace: true,
      });
    }

    addSnack({
      id: "folderDeleted",
      content: t("myNdla.folder.folderDeleted", {
        folderName: selectedFolder.name,
      }),
    });

    const previousFolderId = folders.indexOf(selectedFolder) - 1;
    const nextFolderId = folders.indexOf(selectedFolder) + 1;
    if (folders?.[nextFolderId]?.id || folders?.[previousFolderId]?.id) {
      setFocusId(folders[nextFolderId]?.id ?? folders?.[previousFolderId]?.id);
    } else if (folderRefId) {
      setTimeout(
        () =>
          (
            document.getElementById(folderRefId)?.getElementsByTagName("a")?.[0] ?? document.getElementById(folderRefId)
          )?.focus({ preventScroll: true }),
        1,
      );
    } else if (inToolbar) {
      document.getElementById("titleAnnouncer")?.focus();
    }
  }, [selectedFolder, deleteFolder, folderRefId, setFocusId, addSnack, folderId, inToolbar, navigate, folders, t]);

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];

    const addFolderButton: MenuItemProps = {
      icon: <Plus />,
      text: t("myNdla.newFolderShort"),
      isModal: true,
      modalContent: (close, setFocus) => (
        <CreateModalContent
          onClose={close}
          folders={selectedFolder?.subfolders}
          parentFolder={selectedFolder}
          onCreate={onFolderAdded}
          skipAutoFocus={setFocus}
        />
      ),
    };

    if (!selectedFolder) return [addFolderButton];

    const editFolder: MenuItemProps = {
      icon: <Pencil />,
      text: t("myNdla.folder.editShort"),
      isModal: true,
      modalContent: (close) => (
        <EditFolderModalContent onClose={close} onSaved={onFolderUpdated} folder={selectedFolder} />
      ),
    };

    const shareLink: MenuItemProps = {
      icon: <Share />,
      text: t("myNdla.folder.sharing.button.shareShort"),
      ref: previewRef,
      isModal: true,
      keepOpen: true,
      modalContent: (close) => (
        <FolderShareModalContent
          type="shared"
          folder={selectedFolder}
          onClose={close}
          onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
          onUpdateStatus={async (close) => {
            close();
            unShareRef.current?.click();
          }}
        />
      ),
    };

    const previewFolder: MenuItemProps = {
      icon: <ShareArrow />,
      link: myNdlaRoutes.myNdlaFolder(selectedFolder.id),
      text: t("myNdla.folder.sharing.button.goTo"),
      onClick: () => {
        navigate(myNdlaRoutes.myNdlaFolder(selectedFolder.id));
      },
    };

    const copyLink: MenuItemProps = {
      icon: <Link />,
      text: t("myNdla.folder.sharing.copyLink"),
      onClick: () => {
        navigator.clipboard.writeText(`${config.ndlaFrontendDomain}/folder/${selectedFolder.id}`);
        addSnack({
          content: t("myNdla.resource.linkCopied"),
          id: "linkCopied",
        });
      },
    };

    const unShare: MenuItemProps = {
      icon: <Cross />,
      text: t("myNdla.folder.sharing.button.unShare"),
      isModal: true,
      ref: unShareRef,
      modalContent: (close) => (
        <FolderShareModalContent
          type="unShare"
          folder={selectedFolder}
          onClose={close}
          onUpdateStatus={async (close) => {
            updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: "private",
              },
            });
            close();
            addSnack({
              id: "sharingDeleted",
              content: t("myNdla.folder.sharing.unShare"),
            });
          }}
        />
      ),
    };

    const share: MenuItemProps = {
      icon: <Share />,
      text: t("myNdla.folder.sharing.share"),
      isModal: true,
      ref: shareRef,
      modalContent: (close) => (
        <FolderShareModalContent
          type="private"
          folder={selectedFolder}
          onClose={close}
          onUpdateStatus={async (close) => {
            await updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: "shared",
              },
            });
            close();
            addSnack({
              id: "folderShared",
              content: t("myNdla.folder.sharing.header.shared"),
            });
          }}
        />
      ),
    };

    const deleteOpt: MenuItemProps = {
      icon: <DeleteForever />,
      text: t("myNdla.folder.deleteShort"),
      type: "danger",
      isModal: true,
      modalContent: (close, setSkipAutoFocus) => (
        <DeleteModalContent
          title={t("myNdla.folder.delete")}
          description={t("myNdla.confirmDeleteFolder")}
          removeText={t("myNdla.folder.delete")}
          onDelete={async () => {
            setSkipAutoFocus?.();
            await onDeleteFolder();
            close();
          }}
          onClose={close}
        />
      ),
    };

    const actions = [];

    if (inToolbar && (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock) {
      actions.push(addFolderButton);
    }

    if (isStudent(user)) {
      return actions.concat(editFolder, deleteOpt);
    }

    if (selectedFolder.status === "shared") {
      return actions.concat(editFolder, shareLink, previewFolder, copyLink, unShare, deleteOpt);
    }

    return actions.concat(editFolder, share, deleteOpt);
  }, [
    updateFolderStatus,
    onFolderUpdated,
    onDeleteFolder,
    selectedFolder,
    onFolderAdded,
    inToolbar,
    examLock,
    addSnack,
    navigate,
    user,
    t,
  ]);

  return <SettingsMenu menuItems={actionItems} modalHeader={t("myNdla.tools")} />;
};

export default FolderActions;
