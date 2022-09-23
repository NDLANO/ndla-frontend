/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compact, isEqual, sortBy, uniq } from 'lodash';
import { useEffect, useState } from 'react';
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

const TreestructureContainer = styled.div`
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

const AddResourceToFolder = ({ onClose, resource }: Props) => {
  const { t } = useTranslation();
  const { meta, loading: metaLoading } = useFolderResourceMeta(resource);
  const { folders, loading } = useFolders();
  const [storedResource, setStoredResource] = useState<
    GQLFolderResource | undefined
  >(undefined);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );
  const selectedFolder = useFolder(selectedFolderId);
  const { addSnack } = useSnack();

  useEffect(() => {
    if (!loading && folders) {
      const _storedResource = getResourceForPath(folders, resource.path);
      setStoredResource(_storedResource ?? undefined);
      setSelectedTags(_storedResource?.tags ?? []);
      setTags(tags =>
        compact(
          tags.concat(getAllTags(folders).map(t => ({ id: t, name: t }))),
        ),
      );
    }
  }, [loading, folders, resource]);

  useEffect(() => {
    if (storedResource) {
      setSelectedTags(storedResource.tags);
    }
  }, [storedResource]);

  useEffect(() => {
    setAlreadyAdded(false);
    if (selectedFolder) {
      if (
        selectedFolder.resources.some(
          resource => resource.id === storedResource?.id,
        )
      ) {
        setAlreadyAdded(true);
        setCanSave(false);
      } else {
        setCanSave(true);
      }
    } else if (storedResource) {
      const _canSave = shouldUpdateFolderResource(storedResource, selectedTags);
      setCanSave(_canSave);
    } else {
      setCanSave(false);
    }
  }, [storedResource, selectedTags, selectedFolder]);

  const shouldUpdateFolderResource = (
    storedResource: GQLFolderResource,
    selectedTags: string[],
  ) => {
    const sortedStored = sortBy(storedResource.tags);
    const sortedSelected = sortBy(selectedTags);
    return !isEqual(sortedStored, sortedSelected);
  };

  const structureFolders: FolderType[] = [
    {
      id: 'folders',
      name: t('myNdla.myFolders'),
      status: 'private',
      subfolders: folders,
      breadcrumbs: [],
      resources: [],
    },
  ];
  const { updateFolderResource } = useUpdateFolderResourceMutation();
  const {
    addResourceToFolder,
    loading: addResourceLoading,
  } = useAddResourceToFolderMutation(selectedFolder?.id ?? '');

  const onSave = async () => {
    if (selectedFolder) {
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

  const firstFolder = structureFolders?.[0]?.subfolders[0]?.id;
  const defaultOpenFolders = firstFolder
    ? ['folders', firstFolder]
    : ['folders'];

  return (
    <AddResourceContainer>
      <ListResource
        id={resource.id.toString()}
        tagLinkPrefix="/minndla/tags"
        isLoading={metaLoading}
        link={resource.path}
        title={meta?.title ?? ''}
        topics={meta?.resourceTypes.map(rt => rt.name) ?? []}
        resourceImage={{
          src: meta?.metaImage?.url ?? '',
          alt: meta?.metaImage?.alt ?? '',
        }}
      />
      <TreestructureContainer>
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
        />
      </TreestructureContainer>
      {alreadyAdded && (
        <MessageBox type="danger">{t('myNdla.alreadyInFolder')}</MessageBox>
      )}
      <TagSelector
        prefix="#"
        label={t('myNdla.myTags')}
        tagsSelected={selectedTags}
        tags={tags}
        onToggleTag={tag => {
          if (selectedTags.some(t => t === tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
            return;
          }
          setSelectedTags(prev => uniq(prev.concat(tag)));
        }}
        onCreateTag={tag => {
          if (!tags.some(t => t.id === tag)) {
            setTags(prev => prev.concat({ id: tag, name: tag }));
          }
          setSelectedTags(prev => uniq(prev.concat(tag)));
        }}
      />
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
          disabled={!canSave || addResourceLoading}
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
