/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from 'lodash';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { AddButton } from '@ndla/button';
import { spacing } from '@ndla/core';
import { FolderOutlined } from '@ndla/icons/contentType';
import { FileDocumentOutline } from '@ndla/icons/common';
import { Folder, FolderInput, useSnack } from '@ndla/ui';
import { Pencil } from '@ndla/icons/action';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { HelmetWithTracker } from '@ndla/tracker';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';
import FolderBreadcrumb from './FolderBreadcrumb';
import EditFolderModal from './EditFolderModal';
import {
  foldersPageQuery,
  useAddFolderMutation,
  useFolder,
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from '../folderMutations';
import ResourceList from './ResourceList';
import {
  FolderTotalCount,
  getTotalCountForFolder,
} from '../../../util/folderHelpers';
import DeleteModal from '../components/DeleteModal';
import { usePrevious } from '../../../util/utilityHooks';

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
      grid-template-columns: repeat(3, 1fr);
      gap: ${spacing.normal};
      margin-top: ${spacing.normal};
    `};
`;

const ListItem = styled.li`
  list-style: none;
  margin: 0;
`;

const ResourceCountContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const StyledRow = styled.div`
  margin-top: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
  align-items: top;
`;

export type ViewType = 'list' | 'block' | 'listLarger';
export type FolderActionType = 'edit' | 'delete' | undefined;

export interface FolderAction {
  action: FolderActionType;
  folder: GQLFolder;
  index: number;
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

  const { addFolder } = useAddFolderMutation();
  const { deleteFolder } = useDeleteFolderMutation();

  const [isAdding, setIsAdding] = useState(false);
  const { data: { folders: folderData } = {} } = useGraphQuery<
    GQLFoldersPageQuery
  >(foldersPageQuery);
  const selectedFolder = useFolder(folderId);
  const folders = useMemo(
    () => (selectedFolder ? selectedFolder.subfolders : folderData ?? []),
    [selectedFolder, folderData],
  );
  const previousFolders = usePrevious(folders);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const folderIds = folders.map(f => f.id).sort();
    const prevFolderIds = previousFolders?.map(f => f.id).sort();

    if (!isEqual(folderIds, prevFolderIds) && focusId) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    } else if (
      !isEqual(folderIds, prevFolderIds) &&
      folderIds.length === 1 &&
      prevFolderIds?.length === 1
    ) {
      const id = folders[0]?.id;
      if (id) {
        document.getElementById(id)?.focus();
      }
    }
  }, [folders, focusId, previousFolders]);

  const selectedFolderCount = useMemo(
    () => (selectedFolder ? getTotalCountForFolder(selectedFolder) : undefined),
    [selectedFolder],
  );

  const foldersCount = useMemo(
    () =>
      folders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [folders],
  );

  const allFoldersCount = useMemo(() => {
    return (
      folderData?.reduce((acc, curr) => {
        return acc + getTotalCountForFolder(curr).folders;
      }, 0) ?? 0
    );
  }, [folderData]);

  const { updateFolder } = useUpdateFolderMutation();

  const onDeleteFolder = async (folder: GQLFolder, index: number) => {
    const next = folders[index + 1]?.id;
    const prev = folders[index - 1]?.id;
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

  const onFolderAdd = async (name: string) => {
    setFolderAction(undefined);
    setIsAdding(false);
    const res = await addFolder({
      variables: {
        name,
        parentId: folderId,
      },
    });
    addSnack({
      id: 'folderAdded',
      content: t('myNdla.folder.created', { folderName: name }),
    });
    setFocusId(res.data?.addFolder.id);
  };

  const showAddButton = (selectedFolder?.breadcrumbs.length || 0) < 5;

  return (
    <FoldersPageContainer>
      <HelmetWithTracker
        title={
          selectedFolder
            ? t('htmlTitles.myFolderPage', { folderName: selectedFolder.name })
            : t('htmlTitles.myFoldersPage')
        }
      />
      <FolderBreadcrumb
        breadcrumbs={selectedFolder?.breadcrumbs ?? []}
        onActionChanged={setFolderAction}
      />
      {folders && (
        <ResourceCountContainer>
          <FolderOutlined />
          <span>
            {t('myNdla.folders', {
              count: selectedFolder
                ? selectedFolderCount?.folders
                : allFoldersCount,
            })}
          </span>
          {selectedFolder && (
            <>
              <FileDocumentOutline />
              <span>
                {t('myNdla.resources', {
                  count: selectedFolderCount?.resources ?? allFoldersCount,
                })}
              </span>
            </>
          )}
        </ResourceCountContainer>
      )}
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
      {folders && (
        <BlockWrapper type={type}>
          {isAdding && (
            <FolderInput
              onAddFolder={val => onFolderAdd(val)}
              onClose={() => setIsAdding(false)}
              autoSelect
            />
          )}
          {folders.map((folder, index) => (
            <ListItem key={`folder-${index}`}>
              <Folder
                key={folder.id}
                id={folder.id}
                link={`/minndla/folders/${folder.id}`}
                title={folder.name}
                type={type === 'block' ? 'block' : 'list'}
                subFolders={foldersCount[folder.id]?.folders}
                subResources={foldersCount[folder.id]?.resources}
                menuItems={[
                  {
                    icon: <Pencil />,
                    text: t('myNdla.folder.edit'),
                    onClick: () =>
                      setFolderAction({ action: 'edit', folder, index }),
                  },
                  {
                    icon: <DeleteForever />,
                    text: t('myNdla.folder.delete'),
                    onClick: () =>
                      setFolderAction({ action: 'delete', folder, index }),
                    type: 'danger',
                  },
                ]}
              />
            </ListItem>
          ))}
        </BlockWrapper>
      )}
      {selectedFolder && (
        <ResourceList
          selectedFolder={selectedFolder}
          viewType={type}
          folderId={selectedFolder.id}
        />
      )}
      {folderAction && (
        <>
          <EditFolderModal
            onSave={async value => {
              await updateFolder({
                variables: {
                  id: folderAction.folder.id,
                  name: value,
                },
              });
              addSnack({
                id: 'titleUpdated',
                content: t('myNdla.resource.titleUpdated'),
              });
              setFolderAction(undefined);
            }}
            folder={folderAction.folder}
            isOpen={folderAction.action === 'edit'}
            onClose={() => setFolderAction(undefined)}
          />
          <DeleteModal
            title={t('myNdla.folder.delete')}
            description={t('myNdla.confirmDeleteFolder')}
            removeText={t('myNdla.folder.delete')}
            isOpen={folderAction.action === 'delete'}
            onClose={() => setFolderAction(undefined)}
            onDelete={async () => {
              await onDeleteFolder(folderAction.folder, folderAction.index);
              setFolderAction(undefined);
            }}
          />
        </>
      )}
    </FoldersPageContainer>
  );
};

export default FoldersPage;
