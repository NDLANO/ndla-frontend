/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { InformationLine } from "@ndla/icons";
import { MessageBox, Button, Text, DialogFooter } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GQLAddResourceToFolderStructureQuery,
  GQLAddResourceToFolderStructureQueryVariables,
  GQLFolder,
  GQLMyNdlaResourceConnection,
} from "../../graphqlTypes";
import { foldersPageQueryFragment } from "../../mutations/folder/folderFragments";
import { useAddMyNdlaResourceMutation } from "../../mutations/folder/folderMutations";
import { useFolder } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { AuthContext } from "../AuthenticationContext";
import { SaveHeartButton } from "../SaveHeartButton";
import { useToast } from "../ToastContext";
import { FolderSelect, ROOT_FOLDER_ID } from "./FolderSelect";
import { AddResourceType } from "./types";

export interface ResourceAttributes {
  path: string;
  resourceType: string;
  id: string;
}

interface Props {
  onClose: () => void;
  type: AddResourceType;
  resource: ResourceAttributes;
  defaultOpenFolder?: GQLFolder;
}

const AddResourceContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const WarningText = styled(Text, {
  base: {
    display: "flex",
    gap: "xsmall",
    paddingInline: "medium",
  },
});

interface ResourceAddedSnackProps {
  folder: GQLFolder | null | undefined;
}

const ResourceAddedSnack = ({ folder }: ResourceAddedSnackProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {t("myNdla.resource.addedToFolder")}
      <SafeLink
        to={routes.myNdla.folders(folder?.id)}
      >{`"${folder ? folder.name : t("myNdla.myFavorites")}"`}</SafeLink>
    </div>
  );
};

const structureQueryDef = gql`
  query addResourceToFolderStructure($path: String!) {
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

export const AddResourceToFolder = ({ onClose, resource, defaultOpenFolder, type }: Props) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const { examLock } = useContext(AuthContext);
  const structureQuery = useQuery<GQLAddResourceToFolderStructureQuery, GQLAddResourceToFolderStructureQueryVariables>(
    structureQueryDef,
    { variables: { path: resource.path } },
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const toast = useToast();
  const [addResourceToFolder, { loading: addResourceLoading }] = useAddMyNdlaResourceMutation();

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
    [placements, selectedFolder],
  );

  const onSave = async () => {
    if (alreadyAdded || saved) return;
    const res = await addResourceToFolder({
      variables: {
        resourceId: resource.id,
        resourceType: resource.resourceType,
        path: resource.path,
        folderId: selectedFolder?.id,
      },
      update: (cache, { data }, opts) => {
        if (!data?.addMyNdlaResource) return;
        if (opts.variables?.folderId) {
          cache.modify({
            id: cache.identify({
              __ref: `Folder:${opts.variables.folderId}`,
            }),
            fields: {
              resources(existingResources = []) {
                return existingResources.concat({
                  __ref: cache.identify(data.addMyNdlaResource),
                });
              },
            },
          });
        } else {
          cache.modify({
            fields: {
              myNdlaRootResources(existingResources = []) {
                return existingResources.concat({ __ref: cache.identify(data.addMyNdlaResource) });
              },
            },
          });
        }
        const newResourceConnection: GQLMyNdlaResourceConnection = {
          folderId: opts.variables?.folderId,
          resourceId: data.addMyNdlaResource.id,
        };
        cache.writeQuery({
          query: structureQueryDef,
          variables: { path: resource.path },
          data: {
            ...structureQuery.data,
            myNdlaResourceConnections: structureQuery.data?.myNdlaResourceConnections.concat(newResourceConnection),
          },
        });
      },
    });
    if (!res.error) {
      setSaved(true);
      setTimeout(() => {
        toast.create({
          title: t("myNdla.resource.added"),
          description: <ResourceAddedSnack folder={selectedFolder} />,
        });
        onClose();
      }, 1500);
    } else {
      toast.create({ title: t("myNdla.resource.addedFailed") });
    }
  };

  return (
    <AddResourceContainer>
      {examLock ? (
        <MessageBox variant="warning">
          <InformationLine />
          <Text>{t("myNdla.examLockInfo")}</Text>
        </MessageBox>
      ) : (
        <>
          <FolderSelect
            folders={(structureQuery.data?.folders.folders ?? []) as GQLFolder[]}
            type={type}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={onSetSelectedFolderId}
            defaultOpenFolder={defaultOpenFolder}
            placements={placements}
          />
          {selectedFolder?.status === "shared" && (
            <WarningText id="treestructure-error-label" aria-live="assertive">
              <InformationLine />
              {t("myNdla.addInSharedFolder")}
            </WarningText>
          )}
        </>
      )}
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <SaveHeartButton
          onClick={onSave}
          saved={saved}
          loading={addResourceLoading}
          disabled={(!saved && alreadyAdded) || examLock}
          saveText={t("myNdla.resource.save")}
          savedText={t("myNdla.resource.added")}
          aria-label={
            saved ? t("myNdla.resource.added") : addResourceLoading ? t("loading") : t("myNdla.resource.save")
          }
        />
      </DialogFooter>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
