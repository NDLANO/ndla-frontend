/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createListCollection } from "@ark-ui/react";
import { CloseLine, ArrowDownShortLine, InformationLine, CheckLine } from "@ndla/icons";
import {
  MessageBox,
  Button,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  IconButton,
  Input,
  InputContainer,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import {
  TagSelectorClearTrigger,
  TagSelectorControl,
  TagSelectorInput,
  TagSelectorLabel,
  TagSelectorRoot,
  TagSelectorTrigger,
  useTagSelectorTranslations,
} from "@ndla/ui";
import { uniq } from "@ndla/util";
import { useEffect, useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GQLAddResourceToFolderStructureQuery,
  GQLAddResourceToFolderStructureQueryVariables,
  GQLFolder,
  GQLMyNdlaResource,
} from "../../graphqlTypes";
import { foldersPageQueryFragment, myNdlaResourceFragment } from "../../mutations/folder/folderFragments";
import { useAddMyNdlaResourceMutation, useUpdateMyNdlaResourceMutation } from "../../mutations/folder/folderMutations";
import { useFolder, useMyNdlaResourceMeta } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { useDebounce } from "../../util/useDebounce";
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

const StyledComboboxContent = styled(ComboboxContent, {
  base: {
    display: "flex",
    maxHeight: "320px",
    overflow: "hidden",
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

const shouldUpdateMyNdlaResource = (storedResource: GQLMyNdlaResource, selectedTags: string[]) => {
  if (storedResource.tags.length !== selectedTags.length) return true;
  const storedSet = new Set(storedResource.tags);
  return !selectedTags.every((tag) => storedSet.has(tag));
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
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 100);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const toast = useToast();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const [updateMyNdlaResource] = useUpdateMyNdlaResourceMutation();
  const [addResourceToFolder, { loading: addResourceLoading, called }] = useAddMyNdlaResourceMutation(
    selectedFolder?.id,
  );

  const placements = useMemo(() => {
    const placements = structureQuery.data?.myNdlaResourceConnections.map((c) => c.folderId ?? ROOT_FOLDER_ID) ?? [];
    return new Set(placements);
  }, [structureQuery.data?.myNdlaResourceConnections]);

  const storedResource = structureQuery.data?.myNdlaResource;

  const filteredTags = useMemo(() => {
    if (!debouncedQuery) return structureQuery.data?.myNdlaResourceTags ?? [];
    return (
      structureQuery.data?.myNdlaResourceTags.filter((tag) =>
        tag.toLowerCase().includes(debouncedQuery.toLowerCase()),
      ) ?? []
    );
  }, [debouncedQuery, structureQuery.data?.myNdlaResourceTags]);

  useEffect(() => {
    if (storedResource) {
      setSelectedTags((prevTags) => uniq(prevTags.concat(storedResource?.tags ?? [])));
    }
  }, [storedResource]);

  const alreadyAdded = useMemo(
    () => placements.has(selectedFolder?.id ?? ROOT_FOLDER_ID),
    [placements, selectedFolder],
  );

  const canSave = useMemo(() => {
    if (!storedResource) return true;
    return !alreadyAdded || shouldUpdateMyNdlaResource(storedResource, selectedTags);
  }, [alreadyAdded, selectedTags, storedResource]);

  const allTagsCollection = useMemo(
    () => createListCollection({ items: structureQuery.data?.myNdlaResourceTags ?? [] }),
    [structureQuery.data?.myNdlaResourceTags],
  );

  const onSave = async () => {
    if (!alreadyAdded) {
      const res = await addResourceToFolder({
        variables: {
          resourceId: resource.id,
          resourceType: resource.resourceType,
          path: resource.path,
          folderId: selectedFolder?.id,
          tags: selectedTags,
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
    } else if (storedResource && shouldUpdateMyNdlaResource(storedResource, selectedTags)) {
      const res = await updateMyNdlaResource({ variables: { id: storedResource.id, tags: selectedTags } });
      if (!res.error) {
        onClose();
        toast.create({ title: t("myNdla.resource.tagsUpdated") });
      } else {
        toast.create({ title: t("myNdla.resource.tagsUpdatedFailed") });
      }
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
          <TagSelectorRoot
            value={selectedTags}
            collection={allTagsCollection}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            onValueChange={(details) => setSelectedTags(details.value)}
            translations={tagSelectorTranslations}
          >
            <TagSelectorLabel>{t("myNdla.myTags")}</TagSelectorLabel>
            <HStack gap="4xsmall">
              <TagSelectorControl asChild>
                <InputContainer>
                  <TagSelectorInput asChild>
                    <Input placeholder={t("tagSelector.placeholder")} />
                  </TagSelectorInput>

                  <TagSelectorClearTrigger asChild>
                    <IconButton variant="clear">
                      <CloseLine />
                    </IconButton>
                  </TagSelectorClearTrigger>
                </InputContainer>
              </TagSelectorControl>
              <TagSelectorTrigger asChild>
                <IconButton variant="secondary">
                  <ArrowDownShortLine />
                </IconButton>
              </TagSelectorTrigger>
            </HStack>
            <StyledComboboxContent>
              {filteredTags.map((item) => (
                <ComboboxItem key={item} item={item}>
                  <ComboboxItemText>{item}</ComboboxItemText>
                  <ComboboxItemIndicator>
                    <CheckLine />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              ))}
            </StyledComboboxContent>
          </TagSelectorRoot>
        </>
      )}
      <HStack justify="flex-end" gap="xsmall">
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          onClick={onSave}
          loading={addResourceLoading}
          disabled={!canSave || examLock}
          aria-label={addResourceLoading ? t("loading") : undefined}
        >
          {t("myNdla.resource.save")}
        </Button>
      </HStack>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
