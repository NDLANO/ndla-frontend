/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from 'lodash';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AddButton } from '@ndla/button';
import { breakpoints, mq, spacing } from '@ndla/core';
import { useSnack } from '@ndla/ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';
import EditFolderModal from './EditFolderModal';
import {
  foldersPageQuery,
  useFolder,
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from '../folderMutations';
import ResourceList from './ResourceList';
import DeleteModal from '../components/DeleteModal';
import FoldersPageTitle from './FoldersPageTitle';
import FolderAndResourceCount from './FolderAndResourceCount';
import FolderList from './FolderList';

interface BlockWrapperProps {
  type?: string;
}

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

export const BlockWrapper = styled.ul<BlockWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: 0;
  padding: 0;
  ${props =>
    props.type === 'block' &&
    css`
      display: grid;
      gap: ${spacing.normal};
      margin-top: ${spacing.normal};
      grid-template-columns: repeat(
        3,
        calc(33.33% - (${spacing.normal} / 3 * 2))
      );
      ${mq.range({ until: breakpoints.wide })} {
        grid-template-columns: repeat(2, calc(50% - ${spacing.normal} / 2));
      }
    `};
`;

export const ListItem = styled.li`
  overflow: hidden;
  list-style: none;
  margin: 0;
`;

const StyledRow = styled.div`
  margin-top: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export type ViewType = 'list' | 'block' | 'listLarger';
export type FolderActionType = 'edit' | 'delete' | undefined;

export interface FolderAction {
  action: FolderActionType;
  folder: GQLFolder;
  index?: number;
}

const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const [type, setType] = useState<ViewType>('list');
  const navigate = useNavigate();
  const { addSnack } = useSnack();
  const [folderAction, setFolderAction] = useState<FolderAction | undefined>(
    undefined,
  );

  const {
    deleteFolder,
    loading: deleteFolderLoading,
  } = useDeleteFolderMutation();

  const [isAdding, setIsAdding] = useState(false);
  const { data, loading } = useGraphQuery<GQLFoldersPageQuery>(
    foldersPageQuery,
  );
  const folderData = data?.folders as GQLFolder[] | undefined;

  const hasSelectedFolder = !!folderId;
  const selectedFolder = useFolder(folderId);
  const folders: GQLFolder[] = useMemo(
    () => (selectedFolder ? selectedFolder.subfolders : folderData ?? []),
    [selectedFolder, folderData],
  );
  const [previousFolders, setPreviousFolders] = useState<GQLFolder[]>(folders);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const folderIds = folders.map(f => f.id).sort();
    const prevFolderIds = previousFolders.map(f => f.id).sort();

    if (!isEqual(folderIds, prevFolderIds) && focusId) {
      setTimeout(
        () =>
          document
            .getElementById(`folder-${focusId}`)
            ?.getElementsByTagName('a')?.[0]
            ?.focus(),
        0,
      );
      setFocusId(undefined);
      setPreviousFolders(folders);
    } else if (
      !isEqual(folderIds, prevFolderIds) &&
      folderIds.length === 1 &&
      prevFolderIds?.length === 1
    ) {
      const id = folders[0]?.id;
      if (id) {
        setTimeout(
          () =>
            document
              .getElementById(`folder-${id}`)
              ?.getElementsByTagName('a')?.[0]
              ?.focus(),
          0,
        );
        setPreviousFolders(folders);
      }
    }
  }, [folders, focusId, previousFolders]);

  const {
    updateFolder,
    loading: updateFolderLoading,
  } = useUpdateFolderMutation();

  const onDeleteFolder = async (folder: GQLFolder, index?: number) => {
    const next = index !== undefined ? folders[index + 1]?.id : undefined;
    const prev = index !== undefined ? folders[index - 1]?.id : undefined;
    await deleteFolder({ variables: { id: folder.id } });
    if (folder.id === selectedFolder?.id) {
      navigate(`/minndla/folders/${selectedFolder.parentId ?? ''}`, {
        replace: true,
      });
    }
    addSnack({
      id: 'folderDeleted',
      content: t('myNdla.folder.folderDeleted', { folderName: folder.name }),
    });
    setFocusId(next ?? prev);
  };

  useEffect(() => {
    setIsAdding(false);
  }, [folderId]);

  const onFolderAdd = async (folder: GQLFolder) => {
    setFolderAction(undefined);
    setIsAdding(false);
    addSnack({
      id: 'folderAdded',
      content: t('myNdla.folder.folderCreated', { folderName: folder.name }),
    });
    setFocusId(folder.id);
  };

  const showAddButton = (selectedFolder?.breadcrumbs.length || 0) < 5;

  return (
    <FoldersPageContainer>
      <HelmetWithTracker
        title={
          hasSelectedFolder
            ? t('htmlTitles.myFolderPage', { folderName: selectedFolder?.name })
            : t('htmlTitles.myFoldersPage')
        }
      />
      <FoldersPageTitle
        loading={loading}
        hasSelectedFolder={hasSelectedFolder}
        selectedFolder={selectedFolder}
        setFolderAction={setFolderAction}
      />
      <FolderAndResourceCount
        selectedFolder={selectedFolder}
        hasSelectedFolder={hasSelectedFolder}
        folders={folders}
        folderData={folderData}
        loading={loading}
      />
      <StyledRow>
        {showAddButton && (
          <AddButton
            disabled={isAdding}
            size="xsmall"
            aria-label={t('myNdla.newFolder')}
            onClick={() => setIsAdding(prev => !prev)}>
            <span>{t('myNdla.newFolder')}</span>
          </AddButton>
        )}
        <ListViewOptions type={type} onTypeChange={setType} />
      </StyledRow>
      <FolderList
        onFolderAdd={onFolderAdd}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        type={type}
        folders={folders}
        loading={loading}
        folderId={folderId}
        setFolderAction={setFolderAction}
      />
      {selectedFolder && (
        <ResourceList
          selectedFolder={selectedFolder}
          viewType={type}
          folderId={selectedFolder.id}
        />
      )}
      <EditFolderModal
        loading={updateFolderLoading}
        onSave={async (value, folder) => {
          await updateFolder({
            variables: {
              id: folder.id,
              name: value,
            },
          });
          addSnack({
            id: 'titleUpdated',
            content: t('myNdla.resource.titleUpdated'),
          });
          setFolderAction(undefined);
        }}
        folder={folderAction?.folder}
        isOpen={folderAction?.action === 'edit'}
        onClose={() => setFolderAction(undefined)}
      />
      <DeleteModal
        loading={deleteFolderLoading}
        title={t('myNdla.folder.delete')}
        description={t('myNdla.confirmDeleteFolder')}
        removeText={t('myNdla.folder.delete')}
        isOpen={folderAction?.action === 'delete'}
        onClose={() => setFolderAction(undefined)}
        onDelete={async () => {
          if (folderAction?.action === 'delete') {
            await onDeleteFolder(folderAction.folder, folderAction.index);
            setFolderAction(undefined);
          }
        }}
      />
    </FoldersPageContainer>
  );
};

export default FoldersPage;
