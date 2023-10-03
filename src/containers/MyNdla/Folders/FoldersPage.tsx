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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { FileDocumentOutline, Share } from '@ndla/icons/common';
import { TrashCanOutline } from '@ndla/icons/action';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';
import {
  foldersPageQuery,
  useFolder,
  useUpdateFolderStatusMutation,
} from '../folderMutations';
import { STORED_RESOURCE_VIEW_SETTINGS } from '../../../constants';
import FoldersPageTitle from './FoldersPageTitle';
import FolderAndResourceCount, {
  ResourceCountContainer,
} from './FolderAndResourceCount';
import FolderList from './FolderList';
import { AuthContext } from '../../../components/AuthenticationContext';
import FolderShareModal from './FolderShareModal';
import { copyFolderSharingLink, isStudent } from './util';
import CreateFolderModal from './CreateFolderModal';
import ResourceList from './ResourceList';
import { getAllDimensions } from '../../../util/trackingUtil';

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin-top: ${spacing.normal};
`;

const OptionsWrapper = styled.div`
  display: none;
  flex: 1;
  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
  }
`;

export const BlockWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: 0;
  margin-bottom: ${spacing.medium};
  padding: 0 0 0 ${spacing.medium};

  &[data-type='block'] {
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
  }

  ${mq.range({ until: breakpoints.desktop })} {
    padding: 0;
  }

  &[data-no-padding='true'] {
    padding: 0;
  }
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

const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const { user } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || 'list',
  );
  const { addSnack } = useSnack();
  const { examLock } = useContext(AuthContext);
  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);

  const { data, loading } =
    useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery);

  const hasSelectedFolder = !!folderId;
  const selectedFolder = useFolder(folderId);

  const title = useMemo(() => {
    if (folderId) {
      return t('htmlTitles.myFolderPage', { folderName: selectedFolder?.name });
    } else return t('htmlTitles.myFoldersPage');
  }, [folderId, selectedFolder?.name, t]);

  const folders: GQLFolder[] = useMemo(
    () =>
      selectedFolder
        ? selectedFolder.subfolders
        : (data?.folders as GQLFolder[]) ?? [],
    [selectedFolder, data?.folders],
  );
  const [previousFolders, setPreviousFolders] = useState<GQLFolder[]>(folders);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  useEffect(() => {
    trackPageView({ title, dimensions: getAllDimensions({ user }) });
  }, [title, trackPageView, user]);

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

  const setViewType = useCallback((type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  }, []);

  const showAddButton =
    (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
  const showShareFolder = folderId !== null && !isStudent(user);

  return (
    <FoldersPageContainer>
      <HelmetWithTracker title={title} />
      <FoldersPageTitle
        key={selectedFolder?.id}
        loading={loading}
        selectedFolder={selectedFolder}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
      <FolderAndResourceCount
        selectedFolder={selectedFolder}
        hasSelectedFolder={hasSelectedFolder}
        folders={folders}
        folderData={(data?.folders ?? []) as GQLFolder[]}
        loading={loading}
      />
      {selectedFolder && (
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
                <FolderShareModal
                  type="shared"
                  folder={selectedFolder}
                  onUpdateStatus={async (close) => {
                    close();
                    unShareRef.current?.click();
                  }}
                  onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
                >
                  <ButtonV2
                    colorTheme="lighter"
                    variant="ghost"
                    shape="pill"
                    ref={previewRef}
                  >
                    <Share />
                    {t('myNdla.folder.sharing.button.share')}
                  </ButtonV2>
                </FolderShareModal>
                <FolderShareModal
                  type="unShare"
                  folder={selectedFolder}
                  onUpdateStatus={async (close) => {
                    updateFolderStatus({
                      variables: {
                        folderId: selectedFolder.id,
                        status: 'private',
                      },
                    }).then(() =>
                      setTimeout(() => shareRef.current?.focus(), 100),
                    );
                    close();
                    addSnack({
                      id: 'sharingDeleted',
                      content: t('myNdla.folder.sharing.unShare'),
                    });
                  }}
                >
                  <ButtonV2
                    variant="ghost"
                    colorTheme="danger"
                    shape="pill"
                    ref={unShareRef}
                  >
                    {t('myNdla.folder.sharing.button.unShare')}
                    <TrashCanOutline css={iconCss} />
                  </ButtonV2>
                </FolderShareModal>
              </>
            ) : (
              <FolderShareModal
                type={'private'}
                folder={selectedFolder}
                onUpdateStatus={async (close) => {
                  updateFolderStatus({
                    variables: {
                      folderId: selectedFolder.id,
                      status: 'shared',
                    },
                  }).then(() =>
                    setTimeout(() => previewRef.current?.focus(), 100),
                  );
                  close();
                  addSnack({
                    id: 'folderShared',
                    content: t('myNdla.folder.sharing.header.shared'),
                  });
                }}
              >
                <ButtonV2
                  variant="ghost"
                  colorTheme="lighter"
                  shape="pill"
                  ref={shareRef}
                >
                  <Share />
                  {t('myNdla.folder.sharing.share')}
                </ButtonV2>
              </FolderShareModal>
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
        <ResourceList selectedFolder={selectedFolder} viewType={viewType} />
      )}
    </FoldersPageContainer>
  );
};

export default FoldersPage;
