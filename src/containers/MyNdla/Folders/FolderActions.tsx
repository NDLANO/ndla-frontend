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
import { routes } from "../../../routeHelpers";
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

  const { deleteFolder } = useDeleteFolderMutation();
  const { addFolder } = useAddFolderMutation();
  const { updateFolderStatus } = useUpdateFolderStatusMutation();

  const { user, examLock } = useContext(AuthContext);

  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const unLinkRef = useRef<HTMLButtonElement | null>(null);

  const isFolderShared = selectedFolder?.status !== "private";

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
      navigate(routes.myNdla.folder(selectedFolder.parentId ?? ""), {
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

    const share: MenuItemProps = {
      icon: <Share />,
      text: t("myNdla.folder.sharing.button.shareShort"),
      ref: shareRef,
      isModal: true,
      modalContent: (close) => (
        <FolderShareModalContent
          folder={selectedFolder}
          onClose={close}
          onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
        />
      ),
      onClick: !isFolderShared
        ? () => {
            updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: "shared",
              },
            });
            addSnack({
              id: "folderShared",
              content: t("myNdla.folder.sharing.header.shared"),
            });
          }
        : undefined,
    };

    const previewFolder: MenuItemProps = {
      icon: <ShareArrow />,
      link: routes.folder(selectedFolder.id),
      text: t("myNdla.folder.sharing.button.goTo"),
      onClick: () => {
        navigate(routes.folder(selectedFolder.id));
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
      ref: unShareRef,
      onClick: () => {
        updateFolderStatus({
          variables: {
            folderId: selectedFolder.id,
            status: "private",
          },
        });
        addSnack({
          id: "sharingDeleted",
          content: t("myNdla.folder.sharing.unShare"),
        });
      },
    };

    const deleteLink: MenuItemProps = {
      icon: <Cross />,
      text: t("myNdla.folder.sharing.button.unSaveLink"),
      ref: unLinkRef,
      onClick: () => {
        updateFolderStatus({
          variables: {
            folderId: selectedFolder.id,
            status: "private",
          },
        });
        addSnack({
          id: "linkRemoved",
          content: t("myNdla.folder.sharing.removeLink"),
        });
      },
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

    if (selectedFolder.id === "SharedFolder") {
      return actions.concat(deleteLink);
    }

    if (selectedFolder.status === "shared") {
      return actions.concat(editFolder, share, previewFolder, copyLink, unShare, deleteOpt);
    }

    return actions.concat(editFolder, share, deleteOpt);
  }, [
    onFolderUpdated,
    onDeleteFolder,
    selectedFolder,
    onFolderAdded,
    inToolbar,
    updateFolderStatus,
    examLock,
    addSnack,
    navigate,
    user,
    t,
    isFolderShared,
  ]);

  return <SettingsMenu menuItems={actionItems} modalHeader={t("myNdla.tools")} />;
};

export default FolderActions;
