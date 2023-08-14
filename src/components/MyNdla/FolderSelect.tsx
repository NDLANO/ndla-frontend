/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { TreeStructure } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import NewFolder from './NewFolder';
import { GQLFolder, GQLFolderResource } from '../../graphqlTypes';
import { ComboboxContainer } from './AddResourceToFolder';

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

interface Props {
  folders: GQLFolder[];
  loading: boolean;
  selectedFolderId: string | undefined;
  setSelectedFolderId: (v: string | undefined) => void;
  defaultOpenFolder?: GQLFolder;
  storedResource?: GQLFolderResource;
}

const FolderSelect = ({
  folders,
  loading,
  selectedFolderId,
  setSelectedFolderId,
  defaultOpenFolder,
  storedResource,
}: Props) => {
  const { t } = useTranslation();

  const structureFolders: GQLFolder[] = useMemo(
    () => [
      {
        id: 'folders',
        name: t('myNdla.myFolders'),
        status: 'private',
        subfolders: folders,
        breadcrumbs: [],
        resources: [],
        created: '',
        updated: '',
      },
    ],
    [folders, t],
  );

  const defaultOpenFolders = useMemo(() => {
    const firstFolderId = structureFolders?.[0]?.subfolders[0]?.id;
    const defaultOpenFolderIds = defaultOpenFolder?.breadcrumbs.map(
      (bc) => bc.id,
    );
    const defaultOpen = defaultOpenFolderIds
      ? ['folders'].concat(defaultOpenFolderIds)
      : firstFolderId
      ? ['folders', firstFolderId]
      : ['folders'];

    return defaultOpen;
  }, [structureFolders, defaultOpenFolder?.breadcrumbs]);

  useEffect(() => {
    const last = defaultOpenFolders[defaultOpenFolders.length - 1];
    if (last !== 'folders' && !selectedFolderId) {
      setSelectedFolderId(last);
    }
  }, [defaultOpenFolders, selectedFolderId, setSelectedFolderId]);

  return (
    <ComboboxContainer>
      <TreeStructure
        loading={loading}
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
  );
};
export default FolderSelect;
