/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import compact from "lodash/compact";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import type { ComboboxInputValueChangeDetails } from "@ark-ui/react";
import styled from "@emotion/styled";
import { LoadingButton } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CloseLine } from "@ndla/icons/action";
import { ArrowDownShortLine, InformationLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
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
import { HStack } from "@ndla/styled-system/jsx";
import {
  TagSelectorClearTrigger,
  TagSelectorControl,
  TagSelectorInput,
  TagSelectorLabel,
  TagSelectorRoot,
  TagSelectorTrigger,
  useTagSelectorTranslations,
} from "@ndla/ui";
import FolderSelect from "./FolderSelect";
import ListResource from "./ListResource";
import {
  useAddResourceToFolderMutation,
  useFolder,
  useFolderResourceMeta,
  useFolders,
  useUpdateFolderResourceMutation,
} from "../../containers/MyNdla/folderMutations";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";
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

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

export const AddResourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

export const ComboboxContainer = styled.div`
  display: flex;
  max-height: 320px;
  overflow: hidden;
`;

const StyledComboboxContent = styled(ComboboxContent)`
  display: flex;
  max-height: 320px;
  overflow: hidden;
`;

const StyledInfoMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const AddResourceToFolder = ({ onClose, resource, defaultOpenFolder }: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { meta, loading: metaLoading } = useFolderResourceMeta(resource);
  const { folders, loading } = useFolders();
  const [storedResource, setStoredResource] = useState<GQLFolderResource | undefined>(undefined);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const toast = useToast();
  const tagSelectorTranslations = useTagSelectorTranslations();

  useEffect(() => {
    if (!loading && folders && !storedResource) {
      const _storedResource = getResourceForPath(folders, resource.path);
      setStoredResource(_storedResource ?? undefined);
      const newTags = uniq(compact(getAllTags(folders)));
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
    const sortedStored = sortBy(storedResource.tags);
    const sortedSelected = sortBy(selectedTags);
    return !isEqual(sortedStored, sortedSelected);
  };

  const { updateFolderResource } = useUpdateFolderResourceMutation();
  const { addResourceToFolder, loading: addResourceLoading } = useAddResourceToFolderMutation(selectedFolder?.id ?? "");

  const alreadyAdded = selectedFolder?.resources.some((resource) => resource.id === storedResource?.id);

  const onSave = async () => {
    if (selectedFolder && !alreadyAdded) {
      await addResourceToFolder({
        variables: {
          resourceId: resource.id,
          resourceType: resource.resourceType,
          path: resource.path,
          folderId: selectedFolder.id,
          tags: selectedTags,
        },
      });

      toast.create({
        title: t("myndla.resource.added"),
        description: t("myndla.resource.addedToFolder", { folder: selectedFolder.name }),
      });
    } else if (storedResource && shouldUpdateFolderResource(storedResource, selectedTags)) {
      await updateFolderResource({
        variables: { id: storedResource.id, tags: selectedTags },
      });
      toast.create({
        title: t("myNdla.resource.tagsUpdated"),
      });
    }
    onClose();
  };

  const onInputValueChange = (e: ComboboxInputValueChangeDetails) => {
    const filtered = allTags.filter((item) => item.toLowerCase().includes(e.inputValue.toLowerCase()));
    setTags(filtered);
  };

  const noFolderSelected = selectedFolderId === "folders";

  return (
    <AddResourceContainer>
      <ListResource
        id={resource.id.toString()}
        tagLinkPrefix={routes.myNdla.tags}
        isLoading={metaLoading}
        link={resource.path}
        title={meta?.title ?? ""}
        resourceTypes={meta?.resourceTypes ?? []}
        resourceImage={{
          src: meta?.metaImage?.url ?? "",
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
            {alreadyAdded && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.alreadyInFolder")}</Text>
              </MessageBox>
            )}
            {selectedFolder?.status === "shared" && (
              <MessageBox variant="warning">
                <Text>{t("myNdla.addInSharedFolder")}</Text>
              </MessageBox>
            )}
            {noFolderSelected && (
              <MessageBox variant="error">
                <InformationLine />
                <Text>{t("myNdla.noFolderSelected")}</Text>
              </MessageBox>
            )}
          </StyledInfoMessages>
          <TagSelectorRoot
            value={selectedTags}
            items={allTags}
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
      <ButtonRow>
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
        <LoadingButton
          loading={addResourceLoading}
          colorTheme="light"
          disabled={!canSave || addResourceLoading || noFolderSelected || examLock}
          onClick={onSave}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {t("myNdla.resource.save")}
        </LoadingButton>
      </ButtonRow>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
