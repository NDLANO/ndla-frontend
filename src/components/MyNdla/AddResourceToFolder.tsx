/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection, type ComboboxInputValueChangeDetails } from "@ark-ui/react";
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
import { sortBy, uniq } from "@ndla/util";
import { FolderSelect } from "./FolderSelect";
import { ListResource } from "./ListResource";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";
import {
  useAddResourceToFolderMutation,
  useUpdateFolderResourceMutation,
} from "../../mutations/folder/folderMutations";
import { useFolder, useFolderResourceMeta, useFolders } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { getAllTags, getResourceForPath } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";
import { useToast } from "../ToastContext";

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
  folder: GQLFolder;
}

const ResourceAddedSnack = ({ folder }: ResourceAddedSnackProps) => {
  const { t } = useTranslation();

  return (
    <div>
      {t("myNdla.resource.addedToFolder")}
      <SafeLink to={routes.myNdla.folder(folder.id)}>{`"${folder.name}"`}</SafeLink>
    </div>
  );
};

export const AddResourceToFolder = ({ onClose, resource, defaultOpenFolder }: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { meta, loading: metaLoading } = useFolderResourceMeta(resource);
  const { folders, loading } = useFolders();
  const [storedResource, setStoredResource] = useState<GQLFolderResource | undefined>(undefined);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const toast = useToast();
  const tagSelectorTranslations = useTagSelectorTranslations();

  useEffect(() => {
    if (!loading && folders && !storedResource) {
      const _storedResource = getResourceForPath(folders, resource.path);
      setStoredResource(_storedResource ?? undefined);
      const newTags = uniq(getAllTags(folders).filter((folder) => !!folder));
      setAllTags(newTags ?? []);
      setTags(newTags ?? []);
      setSelectedTags((prevTags) => uniq(prevTags.concat(_storedResource?.tags ?? [])));
    }
  }, [folders, loading, resource.path, storedResource]);

  useEffect(() => {
    const tagsChanged = !!(storedResource && shouldUpdateFolderResource(storedResource, selectedTags));
    if (selectedFolder) {
      if (selectedFolder.id === "folders") {
        setCanSave(false);
      } else if (selectedFolder.resources.some((resource) => resource.id === storedResource?.id)) {
        setCanSave(tagsChanged);
      } else {
        setCanSave(true);
      }
    } else {
      setCanSave(tagsChanged);
    }
  }, [storedResource, selectedTags, selectedFolder, defaultOpenFolder?.id]);

  const shouldUpdateFolderResource = (storedResource: GQLFolderResource, selectedTags: string[]) => {
    const sortedStored = sortBy(storedResource.tags, (tag) => tag);
    const sortedSelected = sortBy(selectedTags, (tag) => tag);
    const isEqual =
      sortedSelected.length === sortedStored.length &&
      sortedSelected.every((value, index) => value === sortedStored[index]);
    return !isEqual;
  };

  const [updateFolderResource] = useUpdateFolderResourceMutation();
  const [addResourceToFolder, { loading: addResourceLoading }] = useAddResourceToFolderMutation(
    selectedFolder?.id ?? "",
  );

  const allTagsCollection = useMemo(() => createListCollection({ items: allTags }), [allTags]);

  const alreadyAdded = selectedFolder?.resources.some((resource) => resource.id === storedResource?.id);

  const onSave = async () => {
    if (selectedFolder && !alreadyAdded) {
      setIsSaving(true);
      const res = await addResourceToFolder({
        variables: {
          resourceId: resource.id,
          resourceType: resource.resourceType,
          path: resource.path,
          folderId: selectedFolder.id,
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
        toast.create({
          title: t("myNdla.resource.addedFailed"),
        });
      }
    } else if (storedResource && shouldUpdateFolderResource(storedResource, selectedTags)) {
      const res = await updateFolderResource({
        variables: { id: storedResource.id, tags: selectedTags },
      });
      if (!res.error) {
        onClose();
        toast.create({
          title: t("myNdla.resource.tagsUpdated"),
        });
      } else {
        toast.create({
          title: t("myNdla.resource.tagsUpdatedFailed"),
        });
      }
    }
  };

  const onInputValueChange = (e: ComboboxInputValueChangeDetails) => {
    const filtered = allTags.filter((item) => item.toLowerCase().includes(e.inputValue.toLowerCase()));
    setTags(filtered);
  };

  const noFolderSelected = selectedFolderId === "folders";
  const disabledButton = !canSave || noFolderSelected || examLock;

  return (
    <AddResourceContainer>
      <ListResource
        nonInteractive
        id={resource.id.toString()}
        isLoading={metaLoading}
        link={resource.path}
        title={meta?.title ?? ""}
        traits={meta?.__typename === "ArticleFolderResourceMeta" ? meta.traits : undefined}
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
            folders={folders}
            loading={loading}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            defaultOpenFolder={defaultOpenFolder}
            storedResource={storedResource}
          />
          <StyledInfoMessages id="treestructure-error-label" aria-live="assertive">
            {!!alreadyAdded && !isSaving && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.alreadyInFolder")}</Text>
              </MessageBox>
            )}
            {selectedFolder?.status === "shared" && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.addInSharedFolder")}</Text>
              </MessageBox>
            )}
            {!!noFolderSelected && (
              <MessageBox variant="error">
                <InformationLine />
                <Text>{t("myNdla.noFolderSelected")}</Text>
              </MessageBox>
            )}
          </StyledInfoMessages>
          <TagSelectorRoot
            value={selectedTags}
            collection={allTagsCollection}
            onInputValueChange={onInputValueChange}
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
              {tags.map((item) => (
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
        <Button
          variant="secondary"
          onClick={onClose}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={onSave}
          loading={addResourceLoading}
          disabled={disabledButton}
          aria-label={addResourceLoading ? t("loading") : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {t("myNdla.resource.save")}
        </Button>
      </HStack>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
