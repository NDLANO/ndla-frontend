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
import { MessageBox, Button, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { uniq } from "@ndla/util";
import { useEffect, useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GQLAddResourceToFolderStructureQuery,
  GQLAddResourceToFolderStructureQueryVariables,
  GQLFolder,
  GQLMyNdlaResourceConnection,
} from "../../graphqlTypes";
import { foldersPageQueryFragment, myNdlaResourceFragment } from "../../mutations/folder/folderFragments";
import { useAddMyNdlaResourceMutation } from "../../mutations/folder/folderMutations";
import { useFolder, useMyNdlaResourceMeta } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { AuthContext } from "../AuthenticationContext";
import { useToast } from "../ToastContext";
import { FolderSelect, ROOT_FOLDER_ID } from "./FolderSelect";
import { ListResource } from "./ListResource";

export interface ResourceAttributes {
  path: string;
  resourceType: string;
  id: string;
}

interface Props {
  onClose: () => void;
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

const StyledInfoMessages = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
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
    myNdlaResource(path: $path) {
      ...MyNdlaResourceFragment
    }
    myNdlaResourceConnections(path: $path) {
      folderId
      resourceId
    }
    myNdlaResourceTags
  }
  ${myNdlaResourceFragment}
  ${foldersPageQueryFragment}
`;

export const AddResourceToFolder = ({ onClose, resource, defaultOpenFolder }: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { meta, loading: metaLoading } = useMyNdlaResourceMeta(resource);
  const structureQuery = useQuery<GQLAddResourceToFolderStructureQuery, GQLAddResourceToFolderStructureQueryVariables>(
    structureQueryDef,
    { variables: { path: resource.path } },
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const toast = useToast();
  const [addResourceToFolder, { loading: addResourceLoading, called }] = useAddMyNdlaResourceMutation();

  const placements = useMemo(() => {
    const placements = structureQuery.data?.myNdlaResourceConnections.map((c) => c.folderId ?? ROOT_FOLDER_ID) ?? [];
    return new Set(placements);
  }, [structureQuery.data?.myNdlaResourceConnections]);

  const storedResource = structureQuery.data?.myNdlaResource;

  useEffect(() => {
    if (storedResource) {
      setSelectedTags((prevTags) => uniq(prevTags.concat(storedResource?.tags ?? [])));
    }
  }, [storedResource]);

  const alreadyAdded = useMemo(
    () => placements.has(selectedFolder?.id ?? ROOT_FOLDER_ID),
    [placements, selectedFolder],
  );

  const onSave = async () => {
    if (alreadyAdded) return;
    const res = await addResourceToFolder({
      variables: {
        resourceId: resource.id,
        resourceType: resource.resourceType,
        path: resource.path,
        folderId: selectedFolder?.id,
        tags: selectedTags,
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
      onClose();
      toast.create({
        title: t("myNdla.resource.added"),
        description: <ResourceAddedSnack folder={selectedFolder} />,
      });
    } else {
      toast.create({ title: t("myNdla.resource.addedFailed") });
    }
  };

  return (
    <AddResourceContainer>
      <ListResource
        nonInteractive
        id={resource.id.toString()}
        isLoading={metaLoading}
        link={resource.path}
        title={meta?.title ?? ""}
        traits={meta?.__typename === "MyNdlaArticleResourceMeta" ? meta.traits : undefined}
        resourceTypes={meta?.resourceTypes}
        storedResourceType={resource.resourceType}
        resourceImage={{
          src: meta?.metaImage?.url,
          alt: meta?.metaImage?.alt ?? "",
        }}
      />
      {examLock ? (
        <MessageBox variant="warning">
          <InformationLine />
          <Text>{t("myNdla.examLockInfo")}</Text>
        </MessageBox>
      ) : (
        <>
          <FolderSelect
            folders={(structureQuery.data?.folders.folders ?? []) as GQLFolder[]}
            loading={structureQuery.loading}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            defaultOpenFolder={defaultOpenFolder}
            placements={placements}
          />
          <StyledInfoMessages id="treestructure-error-label" aria-live="assertive">
            {!!alreadyAdded && !called && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.alreadyInFolder")}</Text>
              </MessageBox>
            )}
            {selectedFolder?.status === "shared" && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.addInSharedFolder")}</Text>
              </MessageBox>
            )}
          </StyledInfoMessages>
        </>
      )}
      <HStack justify="flex-end" gap="xsmall">
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          onClick={onSave}
          loading={addResourceLoading}
          disabled={alreadyAdded || examLock}
          aria-label={addResourceLoading ? t("loading") : undefined}
        >
          {t("myNdla.resource.save")}
        </Button>
      </HStack>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
