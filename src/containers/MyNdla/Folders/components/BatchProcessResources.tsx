/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, StoreObject } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { useDialogContext } from "@ark-ui/react";
import { Button, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ndla/primitives";
import { uniqBy } from "@ndla/util";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { FolderSelect, ROOT_FOLDER_ID } from "../../../../components/MyNdla/FolderSelect";
import { SaveHeartButton } from "../../../../components/SaveHeartButton";
import { useToast } from "../../../../components/ToastContext";
import {
  GQLBatchProcessFoldersQuery,
  GQLBatchProcessFoldersQueryVariables,
  GQLFolder,
  GQLMyNdlaResource,
} from "../../../../graphqlTypes";
import { foldersPageQueryFragment } from "../../../../mutations/folder/folderFragments";
import {
  useBatchCopyMyNdlaResourcesMutation,
  useBatchMoveMyNdlaResourcesMutation,
} from "../../../../mutations/folder/folderMutations";

interface Props {
  currentFolder: GQLFolder | undefined;
  onSuccessfulMutation: VoidFunction;
  resources: GQLMyNdlaResource[];
}

const queryDef = gql`
query batchProcessFolders {
  folders(includeSubfolders: true) {
    folders {
      ...FoldersPageQueryFragment
    }
  }
}
${foldersPageQueryFragment},
`;

export const MoveResourcesDialogContent = ({ currentFolder, resources, onSuccessfulMutation }: Props) => {
  const [mutate, { loading }] = useBatchMoveMyNdlaResourcesMutation();
  const toast = useToast();
  const { t } = useTranslation();
  const { setOpen } = useDialogContext();
  const client = useApolloClient();

  const onProcess = useCallback(
    async (folderId: string | undefined) => {
      const resourceIds = resources.map((r) => r.id);
      const res = await mutate({
        variables: {
          fromFolderId: currentFolder?.id ?? null,
          toFolderId: folderId === ROOT_FOLDER_ID ? null : folderId,
          resourceIds: resources.map((r) => r.id),
        },
      });
      if (res.error) {
        toast.create({ title: t("myNdla.resource.moveResourcesFailed") });
        return;
      }
      setTimeout(() => {
        const newConnections = resourceIds.map((id) => ({
          __ref: client.cache.identify({ id, __typename: "MyNdlaResource" }),
        }));
        if (folderId === ROOT_FOLDER_ID) {
          client.cache.modify({
            fields: {
              myNdlaRootResources(existing, { readField }) {
                return uniqBy(existing.concat(newConnections), (res: any) => readField("id", res));
              },
            },
          });
        } else {
          client.cache.modify({
            id: client.cache.identify({ id: folderId, __typename: "Folder" }),
            fields: {
              resources: (existing, { readField }) =>
                uniqBy(existing.concat(newConnections), (res: any) => readField("id", res)),
            },
          });
        }
        if (!currentFolder?.id) {
          client.cache.modify({
            fields: {
              myNdlaRootResources(existing, { readField }) {
                return existing.filter((ref: any) => !resourceIds.includes(readField("id", ref) as string));
              },
            },
          });
        } else {
          client.cache.modify({
            id: client.cache.identify({ id: currentFolder.id, __typename: "Folder" }),
            fields: {
              resources: (existing, { readField }) =>
                existing.filter((ref: any) => !resourceIds.includes(readField("id", ref) as string)),
            },
          });
        }
        resources.forEach((res) => {
          client.cache.modify({
            id: "ROOT_QUERY",
            fields: {
              myNdlaResourceConnections(existing, { storeFieldName, toReference }) {
                if (storeFieldName !== `myNdlaResourceConnections({"path":"${res.path}"})`) {
                  return existing;
                }
                const ref: StoreObject = {
                  __typename: "MyNdlaResourceConnection",
                  resourceId: res.id,
                  folderId: folderId === ROOT_FOLDER_ID ? null : folderId,
                };
                return existing.concat(toReference(ref, true));
              },
            },
          });
        });
        toast.create({ title: t("myNdla.resource.movedResources") });
        onSuccessfulMutation();
        setOpen(false);
      }, 1500);
    },
    [client.cache, currentFolder, mutate, onSuccessfulMutation, resources, setOpen, t, toast],
  );

  return <BatchProcessResources currentFolder={currentFolder} type="move" onProcess={onProcess} loading={loading} />;
};

export const CopyResourcesDialogContent = ({ currentFolder, resources, onSuccessfulMutation }: Props) => {
  const [mutate, { loading }] = useBatchCopyMyNdlaResourcesMutation();
  const { t } = useTranslation();
  const toast = useToast();
  const { setOpen } = useDialogContext();
  const client = useApolloClient();

  const onProcess = useCallback(
    async (folderId: string | undefined) => {
      const resourceIds = resources.map((r) => r.id);
      const res = await mutate({
        variables: {
          toFolderId: folderId === ROOT_FOLDER_ID ? null : folderId,
          resourceIds,
        },
      });
      if (res.error) {
        toast.create({ title: t("myNdla.resource.copyResourcesFailed") });
        return;
      }

      setTimeout(() => {
        const newConnections = resourceIds.map((id) => ({
          __ref: client.cache.identify({ id, __typename: "MyNdlaResource" }),
        }));
        if (folderId === ROOT_FOLDER_ID) {
          client.cache.modify({
            fields: {
              myNdlaRootResources: (existing, { readField }) =>
                uniqBy(existing.concat(newConnections), (res: any) => readField("id", res)),
            },
          });
        } else {
          client.cache.modify({
            id: client.cache.identify({ id: folderId, __typename: "Folder" }),
            fields: {
              resources: (existing, { readField }) =>
                uniqBy(existing.concat(newConnections), (res: any) => readField("id", res)),
            },
          });
        }
        resources.forEach((res) => {
          client.cache.modify({
            id: "ROOT_QUERY",
            fields: {
              myNdlaResourceConnections(existing, { storeFieldName, toReference }) {
                if (storeFieldName !== `myNdlaResourceConnections({"path":"${res.path}"})`) {
                  return existing;
                }
                const ref: StoreObject = {
                  __typename: "MyNdlaResourceConnection",
                  resourceId: res.id,
                  folderId: folderId === ROOT_FOLDER_ID ? null : folderId,
                };
                return existing.concat(toReference(ref, true));
              },
            },
          });
        });

        toast.create({ title: t("myNdla.resource.copiedResources") });
        onSuccessfulMutation();
        setOpen(false);
      }, 1500);
    },
    [client.cache, mutate, onSuccessfulMutation, resources, setOpen, t, toast],
  );

  return <BatchProcessResources currentFolder={currentFolder} type="copy" onProcess={onProcess} loading={loading} />;
};

interface BatchProcessResourcesProps {
  currentFolder: GQLFolder | undefined;
  type: "move" | "copy";
  onProcess: (folderId: string | undefined) => Promise<void>;
  loading: boolean;
}

export const BatchProcessResources = ({ currentFolder, type, onProcess, loading }: BatchProcessResourcesProps) => {
  const [folderId, setFolderId] = useState<string | undefined>(currentFolder?.id);
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const foldersQuery = useQuery<GQLBatchProcessFoldersQuery, GQLBatchProcessFoldersQueryVariables>(queryDef);

  const onSetFolderId = (id: string | undefined) => {
    setFolderId(id);
    setSaved(false);
  };

  const onSave = async () => {
    await onProcess(folderId);
    setSaved(true);
  };

  const saveText = type === "move" ? t("myNdla.resource.move") : t("myNdla.resource.copy");
  const savedText = type === "move" ? t("myNdla.resource.moved") : t("myNdla.resource.copied");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {type === "move"
            ? t("myNdla.resource.moveResourcesDialogTitle")
            : t("myNdla.resource.copyResourcesDialogTitle")}
        </DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <FolderSelect
        folders={(foldersQuery.data?.folders.folders ?? []) as GQLFolder[]}
        type="myNdla"
        defaultOpenFolder={currentFolder}
        selectedFolderId={folderId}
        setSelectedFolderId={onSetFolderId}
      />
      <DialogFooter>
        <Button variant="secondary" onClick={close}>
          {t("close")}
        </Button>
        <SaveHeartButton
          onClick={onSave}
          saved={saved}
          loading={loading}
          disabled={(folderId === ROOT_FOLDER_ID && !currentFolder) || currentFolder?.id === folderId || examLock}
          saveText={saveText}
          savedText={savedText}
          aria-label={saved ? savedText : loading ? t("loading") : saveText}
        />
      </DialogFooter>
    </DialogContent>
  );
};
