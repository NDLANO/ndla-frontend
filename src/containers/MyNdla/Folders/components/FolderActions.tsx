/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CloseLine, AddLine, PencilLine, DeleteBinLine } from "@ndla/icons/action";
import { ShareLine, ArrowRightLine } from "@ndla/icons/common";
import { LinkMedium } from "@ndla/icons/editor";
import { CreateModalContent } from "./FolderCreateModal";
import { EditFolderModalContent } from "./FolderEditModal";
import { FolderFormValues } from "./FolderForm";
import { FolderShareModalContent } from "./FolderShareModal";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLFolder } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import DeleteModalContent from "../../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";
import {
  useAddFolderMutation,
  useDeleteFolderMutation,
  useUpdateFolderStatusMutation,
  useUnFavoriteSharedFolder,
} from "../../folderMutations";
import { copyFolderSharingLink, isStudent } from "../util";

interface Props {
  selectedFolder: GQLFolder | null;
  folderRefId?: string;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  inToolbar?: boolean;
  folders: GQLFolder[];
  isFavorited?: boolean;
}

const FolderActions = ({ selectedFolder, setFocusId, folders, inToolbar = false, folderRefId, isFavorited }: Props) => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const { deleteFolder } = useDeleteFolderMutation();
  const { addFolder } = useAddFolderMutation();
  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { unFavoriteSharedFolder } = useUnFavoriteSharedFolder();

  const { user, examLock } = useContext(AuthContext);

  const isFolderShared = selectedFolder?.status !== "private";

  const onFolderUpdated = useCallback(() => {
    toast.create({ title: t("myNdla.folder.updated") });
  }, [toast, t]);

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
        toast.create({
          title: t("myNdla.folder.folderCreated", {
            folderName: folder.name,
          }),
        });
        setFocusId(folder.id);
      }
    },
    [addFolder, inToolbar, folderId, selectedFolder?.parentId, toast, t, setFocusId],
  );

  const onDeleteFolder = useCallback(async () => {
    if (!selectedFolder) return;

    await deleteFolder({ variables: { id: selectedFolder.id } });

    if (selectedFolder?.id === folderId) {
      navigate(routes.myNdla.folder(selectedFolder.parentId ?? ""), {
        replace: true,
      });
    }

    toast.create({
      title: t("myNdla.folder.folderDeleted", {
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
  }, [selectedFolder, deleteFolder, folderId, toast, t, folders, folderRefId, inToolbar, navigate, setFocusId]);

  const onUnFavoriteSharedFolder = useCallback(async () => {
    if (!selectedFolder) return;

    await unFavoriteSharedFolder({ variables: { folderId: selectedFolder.id } });

    if (selectedFolder?.id === folderId) {
      navigate(routes.myNdla.folder(selectedFolder.parentId ?? ""), {
        replace: true,
      });
    }

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
  }, [unFavoriteSharedFolder, selectedFolder, folderRefId, setFocusId, folderId, inToolbar, navigate, folders]);

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];

    const addFolderButton: MenuItemProps = {
      type: "dialog",
      value: "newFolder",
      icon: <AddLine />,
      text: t("myNdla.newFolderShort"),
      modalContent: (close) => (
        <CreateModalContent
          onClose={close}
          folders={selectedFolder?.subfolders}
          parentFolder={selectedFolder}
          onCreate={onFolderAdded}
        />
      ),
    };

    if (!selectedFolder) return [addFolderButton];

    const editFolder: MenuItemProps = {
      type: "dialog",
      value: "editFolder",
      icon: <PencilLine />,
      text: t("myNdla.folder.editShort"),
      modalContent: (close) => (
        <EditFolderModalContent onClose={close} onSaved={onFolderUpdated} folder={selectedFolder} />
      ),
    };

    const share: MenuItemProps = {
      type: "dialog",
      value: "shareFolder",
      icon: <ShareLine />,
      text: t("myNdla.folder.sharing.button.shareShort"),
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
            toast.create({
              title: t("myNdla.folder.sharing.header.shared"),
            });
          }
        : undefined,
    };

    const previewFolder: MenuItemProps = {
      type: "link",
      value: "previewFolder",
      icon: <ArrowRightLine />,
      link: routes.folder(selectedFolder.id),
      text: t("myNdla.folder.sharing.button.goTo"),
      onClick: () => {
        navigate(routes.folder(selectedFolder.id));
      },
    };

    const copyLink: MenuItemProps = {
      type: "action",
      value: "copyFolderLink",
      icon: <LinkMedium />,
      text: t("myNdla.folder.sharing.copyLink"),
      onClick: () => {
        navigator.clipboard.writeText(`${config.ndlaFrontendDomain}/folder/${selectedFolder.id}`);
        toast.create({
          title: t("myNdla.resource.linkCopied"),
        });
      },
    };

    const unShare: MenuItemProps = {
      type: "action",
      value: "unshareFolder",
      icon: <CloseLine />,
      text: t("myNdla.folder.sharing.button.unShare"),
      onClick: () => {
        updateFolderStatus({
          variables: {
            folderId: selectedFolder.id,
            status: "private",
          },
        });
        toast.create({
          title: t("myNdla.folder.sharing.unShare"),
        });
      },
    };

    const deleteLink: MenuItemProps = {
      type: "action",
      value: "unfavoriteFolder",
      icon: <CloseLine />,
      text: t("myNdla.folder.sharing.button.unSaveLink"),
      variant: "destructive",
      onClick: async () => {
        await onUnFavoriteSharedFolder();
        toast.create({
          title: t("myNdla.folder.sharing.unSavedLink", { name: selectedFolder.name }),
        });
      },
    };

    const deleteOpt: MenuItemProps = {
      type: "dialog",
      value: "deleteFolder",
      icon: <DeleteBinLine />,
      text: t("myNdla.folder.deleteShort"),
      variant: "destructive",
      modalContent: (close) => (
        <DeleteModalContent
          title={t("myNdla.folder.delete")}
          description={t("myNdla.confirmDeleteFolder")}
          removeText={t("myNdla.folder.delete")}
          onDelete={async () => {
            await onDeleteFolder();
            close();
          }}
          onClose={close}
        />
      ),
    };

    const actions: MenuItemProps[] = [];

    if (inToolbar && (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock) {
      actions.push(addFolderButton);
    }

    if (isFavorited) {
      return actions.concat(deleteLink);
    }

    if (isStudent(user)) {
      return actions.concat(editFolder, deleteOpt);
    }

    if (selectedFolder.status === "shared") {
      return actions.concat(editFolder, share, previewFolder, copyLink, unShare, deleteOpt);
    }

    return actions.concat(editFolder, share, deleteOpt);
  }, [
    examLock,
    t,
    selectedFolder,
    isFolderShared,
    inToolbar,
    isFavorited,
    user,
    onFolderAdded,
    onFolderUpdated,
    updateFolderStatus,
    toast,
    navigate,
    onUnFavoriteSharedFolder,
    onDeleteFolder,
  ]);

  return <SettingsMenu menuItems={actionItems} modalHeader={t("myNdla.tools")} />;
};

export default FolderActions;
