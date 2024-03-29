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
import styled from "@emotion/styled";
import { ButtonV2 as Button, LoadingButton } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { ListResource, MessageBox, TagSelector, useSnack } from "@ndla/ui";
import FolderSelect from "./FolderSelect";
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

const StyledResourceAddedSnack = styled.div`
  gap: ${spacing.small};
  display: flex;
`;

const StyledResource = styled.p`
  margin: 0;
`;

const StyledInfoMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface ResourceAddedSnackProps {
  folder: GQLFolder;
}

const StyledSafeLink = styled(SafeLink)`
  color: ${colors.white};
`;

const ResourceAddedSnack = ({ folder }: ResourceAddedSnackProps) => {
  const { t } = useTranslation();
  return (
    <StyledResourceAddedSnack>
      <StyledResource>
        {t("myNdla.resource.addedToFolder")}
        <StyledSafeLink to={routes.myNdla.folder(folder.id)}>"{folder.name}"</StyledSafeLink>
      </StyledResource>
    </StyledResourceAddedSnack>
  );
};

const AddResourceToFolder = ({ onClose, resource, defaultOpenFolder }: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { meta, loading: metaLoading } = useFolderResourceMeta(resource);
  const { folders, loading } = useFolders();
  const [storedResource, setStoredResource] = useState<GQLFolderResource | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const selectedFolder = useFolder(selectedFolderId);
  const { addSnack } = useSnack();

  useEffect(() => {
    if (!loading && folders && !storedResource) {
      const _storedResource = getResourceForPath(folders, resource.path);
      setStoredResource(_storedResource ?? undefined);
      setTags((tags) => uniq(compact(tags.concat(getAllTags(folders)))));
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
      addSnack({
        id: `addedToFolder${selectedFolder.name}`,
        content: <ResourceAddedSnack folder={selectedFolder} />,
      });
    } else if (storedResource && shouldUpdateFolderResource(storedResource, selectedTags)) {
      await updateFolderResource({
        variables: { id: storedResource.id, tags: selectedTags },
      });
      addSnack({
        content: t("myNdla.resource.tagsUpdated"),
        id: "tagsUpdated",
      });
    }
    onClose();
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
        <MessageBox>
          <InformationOutline />
          {t("myNdla.examLockInfo")}
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
            {alreadyAdded && <MessageBox>{t("myNdla.alreadyInFolder")}</MessageBox>}
            {selectedFolder?.status === "shared" && <MessageBox>{t("myNdla.addInSharedFolder")}</MessageBox>}
            {noFolderSelected && (
              <MessageBox type="danger">
                <InformationOutline />
                {t("myNdla.noFolderSelected")}
              </MessageBox>
            )}
          </StyledInfoMessages>
          <ComboboxContainer>
            <TagSelector
              label={t("myNdla.myTags")}
              selected={selectedTags}
              tags={tags}
              onChange={(tags) => {
                setSelectedTags(tags);
              }}
              onCreateTag={(tag) => {
                setTags((prev) => prev.concat(tag));
                setSelectedTags((prev) => uniq(prev.concat(tag)));
              }}
            />
          </ComboboxContainer>
        </>
      )}
      <ButtonRow>
        <Button
          variant="outline"
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
