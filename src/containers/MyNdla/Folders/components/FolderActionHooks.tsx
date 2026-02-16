/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CloseLine, AddLine, PencilLine, DeleteBinLine, FileCopyLine, ShareLine, ArrowRightLine } from "@ndla/icons";
import { RefObject, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
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
import { FolderCreateModalContent } from "./FolderCreateModalContent";
import { FolderEditModalContent } from "./FolderEditModalContent";
import { FolderFormValues } from "./FolderForm";
import { FolderShareModalContent } from "./FolderShareModalContent";

export const useFolderActions = (
  selectedFolder: GQLFolder | null,
  ref: RefObject<HTMLLIElement | null> | undefined,
  inToolbar?: boolean,
  fallbackFocusId?: string,
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
      navigate(routes.myNdla.folders(folder?.id));

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
    const res = await cloneFolder({ variables: { folderId: selectedFolder.id, destinationFolderId: undefined } });
    if (!res.data?.copySharedFolder) {
      toast.create({ title: t("myNdla.folder.folderCopiedFailed") });
      return;
    }
    const folder = res.data.copySharedFolder;
    navigate(routes.myNdla.folders(folder?.id));
    toast.create({ title: t("myNdla.folder.folderCopied", { folderName: folder.name }) });
  }, [cloneFolder, selectedFolder, navigate, toast, t]);

  const onDeleteFolder = useCallback(
    async (close: VoidFunction) => {
      if (!selectedFolder) return;

      const nextFocusElement = ref?.current?.nextElementSibling ?? ref?.current?.previousElementSibling;

      await deleteFolder({
        variables: { id: selectedFolder.id },
        onCompleted: () => {
          if (selectedFolder.id === folderId) {
            navigate(routes.myNdla.folders(selectedFolder.parentId), { replace: true });
          }
          toast.create({ title: t("myNdla.folder.folderDeleted", { folderName: selectedFolder.name }) });
          if (selectedFolder.id === folderId) return;
          if (nextFocusElement instanceof HTMLElement) {
            setTimeout(() => nextFocusElement.getElementsByTagName("a")?.[0]?.focus({ preventScroll: true }), 1);
          } else if (fallbackFocusId) {
            setTimeout(() => document.getElementById(fallbackFocusId)?.focus({ preventScroll: true }), 1);
          }
        },
        onError: () => {
          toast.create({ title: t("myNdla.folder.folderDeletedFailed", { folderName: selectedFolder.name }) });
        },
      });
      close();
    },
    [selectedFolder, ref, deleteFolder, folderId, toast, t, fallbackFocusId, navigate],
  );

  const onUnFavoriteSharedFolder = useCallback(async () => {
    if (!selectedFolder) return;

    const nextFocusElement = ref?.current?.nextElementSibling ?? ref?.current?.previousElementSibling;
    const res = await unFavoriteSharedFolder({ variables: { folderId: selectedFolder.id } });
    if (res.error) {
      toast.create({ title: t("myNdla.folder.sharing.unSavedLinkFailed") });
      return;
    }

    toast.create({ title: t("myNdla.folder.sharing.unSavedLink", { name: selectedFolder.name }) });

    if (selectedFolder?.id === folderId) {
      navigate(routes.myNdla.folders(selectedFolder.parentId), { replace: true });
      return;
    }

    // TODO: This is probably wrong. It should focus on shared folders, which I'm assuming is in another list?
    if (nextFocusElement instanceof HTMLElement) {
      setTimeout(() => nextFocusElement.getElementsByTagName("a")?.[0]?.focus({ preventScroll: true }), 1);
    } else if (fallbackFocusId) {
      setTimeout(() => document.getElementById(fallbackFocusId)?.focus({ preventScroll: true }), 1);
    }
  }, [selectedFolder, ref, unFavoriteSharedFolder, toast, t, folderId, fallbackFocusId, navigate]);

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
        toast.create({ title: t("myNdla.resource.linkCopied") });
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
