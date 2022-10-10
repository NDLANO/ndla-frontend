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
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { FolderOutlined } from '@ndla/icons/contentType';
import { FileDocumentOutline } from '@ndla/icons/common';
import { Folder, useSnack } from '@ndla/ui';
import { Pencil } from '@ndla/icons/action';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { HelmetWithTracker } from '@ndla/tracker';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import EditFolderModal from './EditFolderModal';
import {
  foldersPageQuery,
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
import NewFolder from '../../../components/MyNdla/NewFolder';
import MyNdlaTitle from '../components/MyNdlaTitle';
import TitleWrapper from '../components/TitleWrapper';
import FolderActions from './FolderActions';

interface BlockWrapperProps {
  type?: string;
}

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const StyledFolderIcon = styled.span`
  display: flex;
  padding: ${spacing.small};
  svg {
    color: ${colors.brand.primary};
    height: 20px;
    width: 20px;
  }
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
      grid-template-columns: repeat(3, 33%);
      ${mq.range({ until: breakpoints.wide })} {
        grid-template-columns: repeat(2, 50%);
      }
      gap: ${spacing.normal};
      margin-top: ${spacing.normal};
    `};
`;

export const ListItem = styled.li`
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
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
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
  const { data } = useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery);
  const folderData = data?.folders as GQLFolder[] | undefined;

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
      }, folderData.length ?? 0) ?? 0
    );
  }, [folderData]);

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
  const crumbs = selectedFolder?.breadcrumbs ?? [];

  const backCrumb =
    crumbs.length > 1
      ? crumbs[crumbs.length - 2]!
      : crumbs.length === 1
      ? 'folders'
      : 'minndla';

  return (
    <FoldersPageContainer>
      <HelmetWithTracker
        title={
          selectedFolder
            ? t('htmlTitles.myFolderPage', { folderName: selectedFolder.name })
            : t('htmlTitles.myFoldersPage')
        }
      />
      <TitleWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={selectedFolder?.breadcrumbs ?? []}
          backCrumb={backCrumb}
          page="folders"
        />
        <TitleRow>
          <MyNdlaTitle title={selectedFolder?.name ?? t('myNdla.myFolders')} />
          {selectedFolder && (
            <FolderActions
              onActionChanged={action =>
                setFolderAction({ action, folder: selectedFolder })
              }
            />
          )}
        </TitleRow>
      </TitleWrapper>
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
            <NewFolder
              icon={
                <StyledFolderIcon>
                  <FolderOutlined />
                </StyledFolderIcon>
              }
              parentId={folderId ?? 'folders'}
              onClose={() => setIsAdding(false)}
              onCreate={onFolderAdd}
            />
          )}
          {folders.map((folder, index) => (
            <ListItem
              key={`folder-${index}`}
              id={`folder-${folder.id}`}
              tabIndex={-1}>
              <Folder
                key={folder.id}
                id={folder.id}
                link={`/minndla/folders/${folder.id}`}
                title={folder.name}
                type={type}
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
