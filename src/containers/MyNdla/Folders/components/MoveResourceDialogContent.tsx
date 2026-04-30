/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { InformationLine } from "@ndla/icons";
import { Button, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { type RefObject, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { FolderSelect, ROOT_FOLDER_ID } from "../../../../components/MyNdla/FolderSelect";
import { SaveHeartButton } from "../../../../components/SaveHeartButton";
import { useToast } from "../../../../components/ToastContext";
import type {
  GQLFolder,
  GQLMoveResourceQuery,
  GQLMoveResourceQueryVariables,
  GQLMyNdlaResource,
  GQLMyNdlaResourceConnection,
} from "../../../../graphqlTypes";
import { foldersPageQueryFragment } from "../../../../mutations/folder/folderFragments";
import { useMoveMyNdlaResourceMutation } from "../../../../mutations/folder/folderMutations";
import { useFolder } from "../../../../mutations/folder/folderQueries";

interface Props {
  close: VoidFunction;
  resource: GQLMyNdlaResource;
  ref: RefObject<HTMLLIElement | null> | undefined;
  fallbackFocusId?: string;
  currentFolder: GQLFolder | undefined;
}

const queryDef = gql`
  query moveResource($path: String!) {
    folders(includeSubfolders: true) {
      folders {
        ...FoldersPageQueryFragment
      }
    }
    myNdlaResourceConnections(path: $path) {
      folderId
      resourceId
    }
  }
  ${foldersPageQueryFragment}
`;

const WarningText = styled(Text, {
  base: {
    display: "flex",
    gap: "xsmall",
    paddingInline: "medium",
  },
});

export const MoveResourceDialogContent = ({ close, resource, currentFolder, ref, fallbackFocusId }: Props) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const toast = useToast();
  const client = useApolloClient();

  const [moveResourceMutation, { loading }] = useMoveMyNdlaResourceMutation();

  const selectedFolder = useFolder(selectedFolderId);
  const structureQuery = useQuery<GQLMoveResourceQuery, GQLMoveResourceQueryVariables>(queryDef, {
    variables: { path: resource.path },
  });

  const onSetSelectedFolderId = (id: string | undefined) => {
    setSelectedFolderId(id);
    setSaved(false);
  };

  const placements = useMemo(() => {
    const placements = structureQuery.data?.myNdlaResourceConnections.map((c) => c.folderId ?? ROOT_FOLDER_ID) ?? [];
    return new Set(placements);
  }, [structureQuery.data?.myNdlaResourceConnections]);

  const alreadyAdded = useMemo(
    () => placements.has(selectedFolder?.id ?? ROOT_FOLDER_ID),
    [placements, selectedFolder?.id],
  );

  const onSave = async () => {
    if (alreadyAdded || saved) return;
    const nextFocusElement = ref?.current?.nextElementSibling ?? ref?.current?.previousElementSibling;
    const fromFolderId = currentFolder?.id ?? null;
    const toFolderId = selectedFolderId === ROOT_FOLDER_ID ? null : (selectedFolderId ?? null);
    const res = await moveResourceMutation({ variables: { id: resource.id, fromFolderId, toFolderId } });
    if (res.error) {
      toast.create({ title: t("myNdla.resource.movedResourceFailed") });
      return;
    }
    setSaved(true);
    setTimeout(() => {
      const filteredConnections =
        structureQuery.data?.myNdlaResourceConnections.filter((conn) => conn.folderId !== fromFolderId) ?? [];

      const newConnection: GQLMyNdlaResourceConnection = {
        folderId: toFolderId as string | undefined,
        resourceId: resource.id,
      };

      client.cache.writeQuery({
        query: queryDef,
        variables: { path: resource.path },
        data: {
          ...structureQuery.data,
          myNdlaResourceConnections: filteredConnections.concat(newConnection),
        },
      });
      if (!fromFolderId) {
        client.cache.modify({
          fields: {
            myNdlaRootResources(existing, { readField }) {
              const filtered = existing.filter((ref: any) => readField("id", ref) !== resource.id);
              return filtered;
            },
          },
        });
      } else {
        client.cache.modify({
          id: client.cache.identify({ id: fromFolderId, __typename: "Folder" }),
          fields: {
            resources(existing, { readField }) {
              const filtered = existing.filter((ref: any) => readField("id", ref) !== resource.id);
              return filtered;
            },
          },
        });
      }
      if (toFolderId) {
        client.cache.modify({
          id: client.cache.identify({ id: toFolderId, __typename: "Folder" }),
          fields: {
            resources(existing) {
              return existing.concat({
                __ref: client.cache.identify({
                  id: resource.id,
                  __typename: "MyNdlaResource",
                }),
              });
            },
          },
        });
      } else {
        client.cache.modify({
          fields: {
            myNdlaRootResources(existing) {
              return existing.concat({
                __ref: client.cache.identify({
                  id: resource.id,
                  __typename: "MyNdlaResource",
                }),
              });
            },
          },
        });
      }
      toast.create({ title: t("myNdla.resource.movedResource") });
      if (nextFocusElement instanceof HTMLElement) {
        setTimeout(() => nextFocusElement.getElementsByTagName("a")?.[0]?.focus({ preventScroll: true }), 1);
      } else if (fallbackFocusId) {
        setTimeout(() => document.getElementById(fallbackFocusId)?.focus({ preventScroll: true }), 1);
      }
      close();
    }, 1500);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.resource.moveResourceTitle")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <FolderSelect
        folders={(structureQuery.data?.folders.folders ?? []) as GQLFolder[]}
        type="myNdla"
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={onSetSelectedFolderId}
        defaultOpenFolder={currentFolder}
        placements={placements}
      />
      {selectedFolder?.status === "shared" && (
        <WarningText id="treestructure-error-label" aria-live="assertive">
          <InformationLine />
          {t("myNdla.addInSharedFolder")}
        </WarningText>
      )}
      <DialogFooter>
        <Button variant="secondary" onClick={close}>
          {t("close")}
        </Button>
        <SaveHeartButton
          onClick={onSave}
          saved={saved}
          loading={loading}
          disabled={!saved && alreadyAdded}
          saveText={t("myNdla.resource.save")}
          savedText={t("myNdla.resource.added")}
          aria-label={saved ? t("myNdla.resource.added") : loading ? t("loading") : t("myNdla.resource.save")}
        />
      </DialogFooter>
    </DialogContent>
  );
};
