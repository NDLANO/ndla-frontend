/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { ListResource, TreeStructure } from '@ndla/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAddFolderMutation,
  useAddResourceToFolderMutation,
  useFolder,
  useFolderResourceMeta,
  useFolders,
} from '../../containers/MyNdla/folderMutations';

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

const AddResourceToFolder = ({ onClose, resource }: Props) => {
  const { t } = useTranslation();
  const { meta } = useFolderResourceMeta(resource);
  const { folders } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );

  const structureFolders = [
    {
      id: 'folders',
      name: t('myNdla.myFolders'),
      status: 'private',
      isFavorite: false,
      subfolders: folders,
      breadcrumbs: [],
      resources: [],
    },
  ];
  const selectedFolder = useFolder(selectedFolderId);
  const { addFolder } = useAddFolderMutation();
  const { addResourceToFolder } = useAddResourceToFolderMutation(
    selectedFolder?.id ?? '',
  );

  const onSave = async () => {
    if (!selectedFolder) return;
    await addResourceToFolder({
      variables: {
        resourceId: resource.id,
        resourceType: resource.resourceType,
        path: resource.path,
        folderId: selectedFolder.id,
      },
    });
    onClose();
  };

  const onAddNewFolder = async (name: string, parentId: string) => {
    const res = await addFolder({
      variables: {
        name,
        parentId: parentId !== 'folders' ? parentId : undefined,
      },
    });
    return res.data!.addFolder;
  };

  return (
    <AddResourceContainer>
      <h1>{t('myNdla.resource.addToMyNdla')}</h1>
      <ListResource
        link={resource.path}
        title={meta?.title ?? ''}
        topics={meta?.resourceTypes.map(rt => rt.name) ?? []}
        resourceImage={{
          src: meta?.metaImage?.url ?? '',
          alt: meta?.metaImage?.url ?? '',
        }}
      />
      <TreeStructure
        folders={structureFolders}
        label={t('myNdla.myFolders')}
        onNewFolder={onAddNewFolder}
        onSelectFolder={setSelectedFolderId}
        defaultOpenFolders={['folders']}
        framed
        editable
      />
      <ButtonRow>
        <Button outline onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button disabled={!selectedFolder} onClick={onSave}>
          {t('save')}
        </Button>
      </ButtonRow>
    </AddResourceContainer>
  );
};

export default AddResourceToFolder;
