/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { CloseLine, AddLine, PencilLine, DeleteBinLine, FileCopyLine, ShareLine, ArrowRightLine } from "@ndla/icons";
import { FolderCreateModalContent } from "./FolderCreateModalContent";
import { FolderEditModalContent } from "./FolderEditModalContent";
import { FolderFormValues } from "./FolderForm";
import { FolderShareModalContent } from "./FolderShareModalContent";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { DeleteModalContent } from "../../../../components/MyNdla/DeleteModalContent";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLFolder } from "../../../../graphqlTypes";
import {
  useAddFolderMutation,
  useCopySharedFolderMutation,
  useDeleteFolderMutation,
  useUpdateFolderStatusMutation,
  useUnFavoriteSharedFolder,
} from "../../../../mutations/folder/folderMutations";
import { routes } from "../../../../routeHelpers";
import { MenuItemProps } from "../../components/SettingsMenu";
import { copyFolderSharingLink, isStudent } from "../util";

export const useFolderActions = (
  selectedFolder: GQLFolder | null,
  setFocusId: Dispatch<SetStateAction<string | undefined>>,
  folders: GQLFolder[],
  inToolbar?: boolean,
  folderRefId?: string,
  isFavorited?: boolean,
) => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [deleteFolder] = useDeleteFolderMutation();
  const [addFolder] = useAddFolderMutation();
  const [cloneFolder] = useCopySharedFolderMutation();
  const [updateFolderStatus] = useUpdateFolderStatusMutation();
  const [unFavoriteSharedFolder] = useUnFavoriteSharedFolder();

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
          parentId: inToolbar ? folderId : (selectedFolder?.parentId ?? undefined),
        },
      });
      const folder = res.data?.addFolder as GQLFolder | undefined;
      navigate(routes.myNdla.folder(folder?.id ?? ""));

      if (folder) {
        toast.create({
          title: t("myNdla.folder.folderCreated", {
            folderName: folder.name,
          }),
        });
      } else {
        toast.create({
          title: t("myNdla.folder.folderCreatedFailed"),
        });
      }
    },
    [addFolder, inToolbar, folderId, selectedFolder?.parentId, navigate, toast, t],
  );

  const onFolderCopied = useCallback(async () => {
    if (!selectedFolder) return;
    const res = await cloneFolder({
      variables: { folderId: selectedFolder.id, destinationFolderId: undefined },
    });
    const folder = res.data?.copySharedFolder as GQLFolder | undefined;
    navigate(routes.myNdla.folder(folder?.id ?? ""));

    if (folder) {
      toast.create({
        title: t("myNdla.folder.folderCopied", {
          folderName: folder.name,
        }),
      });
    } else {
      toast.create({
        title: t("myNdla.folder.folderCopiedFailed"),
      });
    }
  }, [cloneFolder, selectedFolder, navigate, toast, t]);

  const onDeleteFolder = useCallback(
    async (close: VoidFunction) => {
      if (!selectedFolder) return;

      const res = await deleteFolder({ variables: { id: selectedFolder.id } });

      if (!res.error) {
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
                document.getElementById(folderRefId)?.getElementsByTagName("a")?.[0] ??
                document.getElementById(folderRefId)
              )?.focus({ preventScroll: true }),
            1,
          );
        } else if (inToolbar) {
          document.getElementById("titleAnnouncer")?.focus();
        }
      } else {
        toast.create({
          title: t("myNdla.folder.folderDeleted", {
            folderName: selectedFolder.name,
          }),
        });
      }
      close();
    },
    [selectedFolder, deleteFolder, folderId, toast, t, folders, folderRefId, inToolbar, navigate, setFocusId],
  );

  const onUnFavoriteSharedFolder = useCallback(async () => {
    if (!selectedFolder) return;

    const res = await unFavoriteSharedFolder({ variables: { folderId: selectedFolder.id } });
    if (!res.error) {
      toast.create({
        title: t("myNdla.folder.sharing.unSavedLink", { name: selectedFolder.name }),
      });

      if (selectedFolder?.id === folderId) {
        navigate(routes.myNdla.folder(selectedFolder.parentId ?? ""), {
          replace: true,
        });
      } else {
        toast.create({
          title: t("myNdla.folder.sharing.unSavedLinkFailed"),
        });
      }
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
  }, [
    selectedFolder,
    unFavoriteSharedFolder,
    folders,
    folderRefId,
    inToolbar,
    toast,
    t,
    folderId,
    navigate,
    setFocusId,
  ]);

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];

    const addFolderButton: MenuItemProps = {
      type: "dialog",
      value: "newFolder",
      icon: <AddLine />,
      text: t("myNdla.newFolderShort"),
      modalContent: (close) => (
        <FolderCreateModalContent onClose={close} parentFolder={selectedFolder} onCreate={onFolderAdded} />
      ),
    };

    if (!selectedFolder) return [addFolderButton];

    const copyFolder: MenuItemProps = {
      type: "action",
      value: "cloneFolderLink",
      icon: <FileCopyLine />,
      text: t("myNdla.folder.copy"),
      onClick: onFolderCopied,
    };

    const editFolder: MenuItemProps = {
      type: "dialog",
      value: "editFolder",
      icon: <PencilLine />,
      text: t("myNdla.folder.editShort"),
      modalContent: (close) => (
        <FolderEditModalContent onClose={close} onSaved={onFolderUpdated} folder={selectedFolder} />
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
        ? async () => {
            const res = await updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: "shared",
              },
            });
            if (!res.error) {
              toast.create({
                title: t("myNdla.folder.sharing.folderShared"),
              });
            } else {
              toast.create({
                title: t("myNdla.folder.sharing.folderSharedFailed"),
              });
            }
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
      icon: <FileCopyLine />,
      text: t("myNdla.folder.sharing.button.shareLink"),
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
      onClick: async () => {
        const res = await updateFolderStatus({
          variables: {
            folderId: selectedFolder.id,
            status: "private",
          },
        });
        if (!res.error) {
          toast.create({
            title: t("myNdla.folder.sharing.unShare"),
          });
        } else {
          toast.create({
            title: t("myNdla.folder.sharing.unShareFailed"),
          });
        }
      },
    };

    const deleteLink: MenuItemProps = {
      type: "action",
      value: "unfavoriteFolder",
      icon: <CloseLine />,
      text: t("myNdla.folder.sharing.button.unSaveLink"),
      variant: "destructive",
      onClick: onUnFavoriteSharedFolder,
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
          onDelete={() => onDeleteFolder(close)}
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
      return actions.concat(editFolder, share, previewFolder, copyLink, unShare, copyFolder, deleteOpt);
    }

    return actions.concat(editFolder, share, copyFolder, deleteOpt);
  }, [
    examLock,
    t,
    selectedFolder,
    isFolderShared,
    inToolbar,
    isFavorited,
    user,
    onFolderAdded,
    onFolderCopied,
    onFolderUpdated,
    updateFolderStatus,
    toast,
    navigate,
    onUnFavoriteSharedFolder,
    onDeleteFolder,
  ]);
  return actionItems;
};
