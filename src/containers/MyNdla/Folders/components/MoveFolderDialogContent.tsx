/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { Button, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ndla/primitives";
import { RefObject, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { FolderSelect, ROOT_FOLDER_ID } from "../../../../components/MyNdla/FolderSelect";
import { SaveHeartButton } from "../../../../components/SaveHeartButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLFolder, GQLMoveFolderDialogQuery, GQLMoveFolderDialogQueryVariables } from "../../../../graphqlTypes";
import { foldersPageQueryFragment } from "../../../../mutations/folder/folderFragments";
import { useMoveFolderMutation } from "../../../../mutations/folder/folderMutations";

interface Props {
  close: VoidFunction;
  currentFolder: GQLFolder;
  ref: RefObject<HTMLLIElement | null> | undefined;
  fallbackFocusId?: string;
}

const queryDef = gql`
query moveFolderDialog {
  folders(includeSubfolders: true) {
    folders {
      ...FoldersPageQueryFragment
    }
  }
}
${foldersPageQueryFragment},
`;

export const MoveFolderDialogContent = ({ close, currentFolder, ref, fallbackFocusId }: Props) => {
  const [folderId, setFolderId] = useState<string | undefined>(currentFolder.parentId ?? ROOT_FOLDER_ID);
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();
  const [moveFolder, { loading }] = useMoveFolderMutation();
  const client = useApolloClient();
  const toast = useToast();
  const { examLock } = useContext(AuthContext);

  const foldersQuery = useQuery<GQLMoveFolderDialogQuery, GQLMoveFolderDialogQueryVariables>(queryDef);

  const onSetFolderId = (id: string | undefined) => {
    setFolderId(id);
    setSaved(false);
  };

  const onMoveFolder = useCallback(
    async (folderId: string | undefined) => {
      if (!currentFolder || saved) return;

      const nextFocusElement = ref?.current?.nextElementSibling ?? ref?.current?.previousElementSibling;
      const res = await moveFolder({
        variables: { parentId: folderId === ROOT_FOLDER_ID ? null : folderId, id: currentFolder.id },
      });
      if (res.error) {
        toast.create({ title: t("myNdla.folder.moveFolderFailed") });
        return;
      }
      setSaved(true);
      setTimeout(() => {
        if (res.data && !res.data.moveFolder.parentId) {
          client.cache.modify({
            fields: {
              folders: (existing) => {
                return {
                  folders: existing?.folders.concat({
                    __ref: client.cache.identify({ id: res.data?.moveFolder.id, __typename: "Folder" }),
                  }),
                  sharedFolders: existing?.sharedFolders,
                };
              },
            },
          });
        } else if (res.data?.moveFolder.parentId) {
          client.cache.modify({
            id: client.cache.identify({ id: res.data.moveFolder.parentId, __typename: "Folder" }),
            fields: {
              subfolders: (existing) => {
                return (existing ?? []).concat({
                  __ref: client.cache.identify({ id: res.data?.moveFolder.id, __typename: "Folder" }),
                });
              },
            },
          });
        }
        if (!currentFolder.parentId) {
          client.cache.modify({
            fields: {
              folders: (existing, { readField }) => {
                return {
                  folders: existing?.folders?.filter((f: any) => readField("id", f) !== currentFolder.id),
                  sharedFolders: existing?.sharedFolders,
                };
              },
            },
          });
        } else {
          client.cache.modify({
            id: client.cache.identify({ id: currentFolder.parentId, __typename: "Folder" }),
            fields: {
              subfolders: (existing, { readField }) =>
                existing.filter((f: any) => readField("id", f) !== currentFolder.id),
            },
          });
        }
        toast.create({ title: t("myNdla.folder.movedFolder") });
        if (nextFocusElement instanceof HTMLElement) {
          setTimeout(() => nextFocusElement.getElementsByTagName("a")?.[0]?.focus({ preventScroll: true }), 1);
        } else if (fallbackFocusId) {
          setTimeout(() => document.getElementById(fallbackFocusId)?.focus({ preventScroll: true }), 1);
        }
        close();
      }, 1500);
    },
    [client.cache, close, currentFolder, fallbackFocusId, moveFolder, ref, saved, t, toast],
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.folder.moveFolderTitle")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <FolderSelect
        folders={(foldersQuery.data?.folders?.folders ?? []) as GQLFolder[]}
        folderToMove={currentFolder}
        type="folder"
        defaultOpenFolder={{ ...currentFolder, breadcrumbs: currentFolder.breadcrumbs.slice(0, -1) }}
        selectedFolderId={folderId}
        setSelectedFolderId={onSetFolderId}
      />
      <DialogFooter>
        <Button variant="secondary" onClick={close}>
          {t("close")}
        </Button>
        <SaveHeartButton
          onClick={() => onMoveFolder(folderId)}
          saved={saved}
          loading={loading}
          disabled={
            saved ||
            (folderId === ROOT_FOLDER_ID && !currentFolder.parentId) ||
            currentFolder.parentId === folderId ||
            examLock
          }
          saveText={t("myNdla.folder.save")}
          savedText={t("myNdla.folder.added")}
          aria-label={saved ? t("myNdla.folder.added") : loading ? t("loading") : t("myNdla.folder.save")}
        />
      </DialogFooter>
    </DialogContent>
  );
};
