/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from 'lodash/isEqual';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, mq, spacing } from '@ndla/core';
import { useSnack } from '@ndla/ui';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { FileDocumentOutline, Share } from '@ndla/icons/common';
import { TrashCanOutline } from '@ndla/icons/action';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';
import EditFolderModal from './EditFolderModal';
import {
  foldersPageQuery,
  useFolder,
  useDeleteFolderMutation,
  useUpdateFolderStatusMutation,
} from '../folderMutations';
import ResourceList from './ResourceList';
import DeleteModal from '../components/DeleteModal';
import { STORED_RESOURCE_VIEW_SETTINGS } from '../../../constants';
import FoldersPageTitle from './FoldersPageTitle';
import FolderAndResourceCount, {
  ResourceCountContainer,
} from './FolderAndResourceCount';
import FolderList from './FolderList';
import { AuthContext } from '../../../components/AuthenticationContext';
import FolderShareModal from './FolderShareModal';
import config from '../../../config';
import { copyFolderSharingLink, isStudent } from './util';
import CreateFolderModal from './CreateFolderModal';

interface BlockWrapperProps {
  type?: string;
}

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const OptionsWrapper = styled.div`
  display: none;
  flex: 1;
  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
  }
`;

export const BlockWrapper = styled.ul<BlockWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: 0;
  margin-bottom: ${spacing.medium};
  padding: 0;
  ${(props) =>
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

const iconCss = css`
  width: 22px;
  height: 22px;
`;

export const ListItem = styled.li`
  overflow: hidden;
  list-style: none;
  margin: 0;
`;

const StyledRow = styled.div`
  margin: ${spacing.small} 0;
  gap: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledEm = styled.em`
  white-space: pre-wrap;
`;

export type ViewType = 'list' | 'block' | 'listLarger';
export type FolderActionType =
  | 'edit'
  | 'delete'
  | 'shared'
  | 'unShare'
  | 'private'
  | undefined;
export interface FolderAction {
  action: FolderActionType;
  folder: GQLFolder;
  index?: number;
}

const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const { user } = useContext(AuthContext);
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || 'list',
  );
  const navigate = useNavigate();
  const { addSnack } = useSnack();
  const { examLock } = useContext(AuthContext);
  const [folderAction, setFolderAction] = useState<FolderAction | undefined>(
    undefined,
  );

  const { deleteFolder, loading: deleteFolderLoading } =
    useDeleteFolderMutation();

  const { data, loading } =
    useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery);
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
    const folderIds = folders.map((f) => f.id).sort();
    const prevFolderIds = previousFolders.map((f) => f.id).sort();

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

  const { updateFolderStatus } = useUpdateFolderStatusMutation();

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

  const onFolderUpdated = () => {
    addSnack({
      id: 'folderUpdated',
      content: t('myNdla.folder.updated'),
    });
  };

  const onFolderAdded = useCallback(
    (folder?: GQLFolder) => {
      if (folder) {
        addSnack({
          id: 'folderAdded',
          content: t('myNdla.folder.folderCreated', {
            folderName: folder.name,
          }),
        });
        setFocusId(folder.id);
      }
    },
    [addSnack, t],
  );

  const setViewType = (type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  };

  const showAddButton =
    (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
  const showShareFolder = folderId !== null && !isStudent(user);

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
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
      <FolderAndResourceCount
        selectedFolder={selectedFolder}
        hasSelectedFolder={hasSelectedFolder}
        folders={folders}
        folderData={folderData}
        loading={loading}
      />
      {selectedFolder && config.folderDescriptionEnabled && (
        <p>
          <StyledEm>
            {selectedFolder.description ??
              t('myNdla.folder.defaultPageDescription')}
          </StyledEm>
        </p>
      )}
      <StyledRow>
        {showAddButton && (
          <CreateFolderModal
            onSaved={onFolderAdded}
            parentFolder={selectedFolder}
          />
        )}

        <OptionsWrapper>
          {showShareFolder &&
            selectedFolder &&
            (selectedFolder?.status !== 'private' ? (
              <>
                <ButtonV2
                  colorTheme="lighter"
                  variant="ghost"
                  shape="pill"
                  onClick={() =>
                    setFolderAction({
                      folder: selectedFolder,
                      action: 'shared',
                      index: 0,
                    })
                  }
                >
                  <Share />
                  {t('myNdla.folder.sharing.button.share')}
                </ButtonV2>
                <ButtonV2
                  variant="ghost"
                  colorTheme="danger"
                  shape="pill"
                  onClick={() =>
                    setFolderAction({
                      folder: selectedFolder,
                      action: 'unShare',
                      index: 0,
                    })
                  }
                >
                  {t('myNdla.folder.sharing.button.unShare')}
                  <TrashCanOutline css={iconCss} />
                </ButtonV2>
              </>
            ) : (
              <ButtonV2
                variant="ghost"
                colorTheme="lighter"
                shape="pill"
                onClick={() =>
                  setFolderAction({
                    folder: selectedFolder,
                    action: 'private',
                    index: 0,
                  })
                }
              >
                <Share />
                {t('myNdla.folder.sharing.share')}
              </ButtonV2>
            ))}

          <ListViewOptions type={viewType} onTypeChange={setViewType} />
        </OptionsWrapper>
      </StyledRow>
      <FolderList
        onViewTypeChange={setViewType}
        type={viewType}
        folders={folders}
        loading={loading}
        folderId={folderId}
        setFolderAction={setFolderAction}
      />
      {!!selectedFolder?.resources.length && (
        <ResourceCountContainer>
          <FileDocumentOutline />
          <span>
            {t('myNdla.resources', {
              count: selectedFolder?.resources.length,
            })}
          </span>
        </ResourceCountContainer>
      )}
      {selectedFolder && (
        <ResourceList
          selectedFolder={selectedFolder}
          viewType={viewType}
          folderId={selectedFolder.id}
        />
      )}
      <EditFolderModal
        onSaved={onFolderUpdated}
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
      {folderAction && (
        <>
          <FolderShareModal
            type={'shared'}
            folder={folderAction.folder}
            isOpen={folderAction.action === 'shared'}
            onClose={() => setFolderAction(undefined)}
            onUpdateStatus={() =>
              setFolderAction({
                action: 'unShare',
                folder: folderAction.folder,
              })
            }
            onCopyText={() => copyFolderSharingLink(folderAction.folder.id)}
          />
          <FolderShareModal
            type={'private'}
            folder={folderAction.folder}
            isOpen={folderAction.action === 'private'}
            onClose={() => setFolderAction(undefined)}
            onUpdateStatus={async () => {
              await updateFolderStatus({
                variables: {
                  folderId: folderAction.folder.id,
                  status: 'shared',
                },
              });
              setFolderAction({ ...folderAction, action: 'shared' });
            }}
          />
          <FolderShareModal
            type={'unShare'}
            folder={folderAction.folder}
            isOpen={folderAction.action === 'unShare'}
            onClose={() => {
              setFolderAction(undefined);
            }}
            onUpdateStatus={() => {
              updateFolderStatus({
                variables: {
                  folderId: folderAction.folder.id,
                  status: 'private',
                },
              });
              setFolderAction(undefined);
              addSnack({
                id: 'sharingDeleted',
                content: t('myNdla.folder.sharing.unShare'),
              });
            }}
          />
        </>
      )}
    </FoldersPageContainer>
  );
};

export default FoldersPage;
