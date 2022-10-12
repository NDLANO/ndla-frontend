/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compact, isEqual, sortBy, uniq } from 'lodash';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 as Button, LoadingButton } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import {
  FolderType,
  ListResource,
  MessageBox,
  TagSelector,
  TreeStructure,
  useSnack,
} from '@ndla/ui';
import {
  useAddResourceToFolderMutation,
  useFolder,
  useFolderResourceMeta,
  useFolders,
  useUpdateFolderResourceMutation,
} from '../../containers/MyNdla/folderMutations';
import { GQLFolder, GQLFolderResource } from '../../graphqlTypes';
import { getAllTags, getResourceForPath } from '../../util/folderHelpers';
import NewFolder from './NewFolder';

export interface ResourceAttributes {
  path: string;
  resourceType: string;
  id: number;
}

interface Props {
  onClose: () => void;
  resource: ResourceAttributes;
  defaultOpenFolder?: GQLFolder;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const AddResourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const ComboboxContainer = styled.div`
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

const StyledNewFolder = styled(NewFolder)`
  border-left: ${spacing.xsmall} solid ${colors.brand.light};
  border-right: ${spacing.xsmall} solid ${colors.brand.light};
  &:focus-within {
    border-color: ${colors.brand.light};
  }
  // Not good practice, but necessary to give error message same padding as caused by border.
  & + span {
    padding: 0 ${spacing.xsmall};
  }
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
        {t('myNdla.resource.addedToFolder')}
        <StyledSafeLink to={`/minndla/folders/${folder.id}`}>
          "{folder.name}"
        </StyledSafeLink>
      </StyledResource>
    </StyledResourceAddedSnack>
  );
};

const AddResourceToFolder = ({
  onClose,
  resource,
  defaultOpenFolder,
}: Props) => {
  const { t } = useTranslation();
  const { meta, loading: metaLoading } = useFolderResourceMeta(resource);
  const { folders, loading } = useFolders();
  const [storedResource, setStoredResource] = useState<
    GQLFolderResource | undefined
  >(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );
  const selectedFolder = useFolder(selectedFolderId);
  const { addSnack } = useSnack();

  useEffect(() => {
    if (!loading && folders) {
      const _storedResource = getResourceForPath(folders, resource.path);
      setStoredResource(_storedResource ?? undefined);
      setSelectedTags(uniq(selectedTags.concat(_storedResource?.tags ?? [])));
      setTags(tags => uniq(compact(tags.concat(getAllTags(folders)))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (storedResource) {
      setSelectedTags(storedResource.tags);
    }
  }, [storedResource]);

  useEffect(() => {
    const tagsChanged = !!(
      storedResource && shouldUpdateFolderResource(storedResource, selectedTags)
    );
    if (selectedFolder) {
      if (selectedFolder.id === 'folders') {
        setCanSave(false);
      } else if (
        selectedFolder.resources.some(
          resource => resource.id === storedResource?.id,
        )
      ) {
        setCanSave(tagsChanged);
      } else {
        setCanSave(true);
      }
    } else {
      setCanSave(tagsChanged);
    }
  }, [storedResource, selectedTags, selectedFolder, defaultOpenFolder?.id]);

  const shouldUpdateFolderResource = (
    storedResource: GQLFolderResource,
    selectedTags: string[],
  ) => {
    const sortedStored = sortBy(storedResource.tags);
    const sortedSelected = sortBy(selectedTags);
    return !isEqual(sortedStored, sortedSelected);
  };

  const structureFolders: FolderType[] = useMemo(
    () => [
      {
        id: 'folders',
        name: t('myNdla.myFolders'),
        status: 'private',
        subfolders: folders,
        breadcrumbs: [],
        resources: [],
      },
    ],
    [folders, t],
  );

  const { updateFolderResource } = useUpdateFolderResourceMutation();
  const {
    addResourceToFolder,
    loading: addResourceLoading,
  } = useAddResourceToFolderMutation(selectedFolder?.id ?? '');

  const alreadyAdded = selectedFolder?.resources.some(
    resource => resource.id === storedResource?.id,
  );

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
    } else if (
      storedResource &&
      shouldUpdateFolderResource(storedResource, selectedTags)
    ) {
      await updateFolderResource({
        variables: { id: storedResource.id, tags: selectedTags },
      });
      addSnack({
        content: t('myNdla.resource.tagsUpdated'),
        id: 'tagsUpdated',
      });
    }
    onClose();
  };

  const defaultOpenFolders = useMemo(() => {
    const firstFolderId = structureFolders?.[0]?.subfolders[0]?.id;
    const defaultOpenFolderIds = defaultOpenFolder?.breadcrumbs.map(
      bc => bc.id,
    );
    const defaultOpen = defaultOpenFolderIds
      ? ['folders'].concat(defaultOpenFolderIds)
      : firstFolderId
      ? ['folders', firstFolderId]
      : ['folders'];

    const last = defaultOpen[defaultOpen.length - 1];
    if (last !== 'folders' && !selectedFolderId) {
      setSelectedFolderId(last);
    }

    return defaultOpen;
  }, [structureFolders, defaultOpenFolder, selectedFolderId]);

  const noFolderSelected = selectedFolderId === 'folders';

  return (
    <AddResourceContainer>
      <ListResource
        id={resource.id.toString()}
        tagLinkPrefix="/minndla/tags"
        isLoading={metaLoading}
        link={resource.path}
        title={meta?.title ?? ''}
        resourceTypes={meta?.resourceTypes ?? []}
        resourceImage={{
          src: meta?.metaImage?.url ?? '',
          alt: meta?.metaImage?.alt ?? '',
        }}
      />
      <ComboboxContainer>
        <TreeStructure
          folders={structureFolders}
          label={t('myNdla.myFolders')}
          onSelectFolder={setSelectedFolderId}
          defaultOpenFolders={defaultOpenFolders}
          type={'picker'}
          targetResource={storedResource}
          newFolderInput={({ parentId, onClose, onCreate }) => (
            <StyledNewFolder
              parentId={parentId}
              onClose={onClose}
              onCreate={onCreate}
            />
          )}
          ariaDescribedby="treestructure-error-label"
        />
      </ComboboxContainer>
      <div id="treestructure-error-label" aria-live="assertive">
        {alreadyAdded && <MessageBox>{t('myNdla.alreadyInFolder')}</MessageBox>}
        {noFolderSelected && (
          <MessageBox type="danger">{t('myNdla.noFolderSelected')}</MessageBox>
        )}
      </div>
      <ComboboxContainer>
        <TagSelector
          label={t('myNdla.myTags')}
          selected={selectedTags}
          tags={tags}
          onChange={tags => {
            setSelectedTags(tags);
          }}
          onCreateTag={tag => {
            setTags(prev => prev.concat(tag));
            setSelectedTags(prev => uniq(prev.concat(tag)));
          }}
        />
      </ComboboxContainer>
      <ButtonRow>
        <Button
          variant="outline"
          onClick={onClose}
          onMouseDown={e => {
            e.preventDefault();
          }}
          onMouseUp={e => {
            e.preventDefault();
          }}>
          {t('cancel')}
        </Button>
        <LoadingButton
          loading={addResourceLoading}
          disabled={!canSave || addResourceLoading || noFolderSelected}
          onClick={onSave}
          onMouseDown={e => {
            e.preventDefault();
          }}
          onMouseUp={e => {
            e.preventDefault();
          }}>
          {t('myNdla.resource.save')}
        </LoadingButton>
      </ButtonRow>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
