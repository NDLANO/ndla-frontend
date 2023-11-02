/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { Cross, Copy } from '@ndla/icons/action';
import { Share } from '@ndla/icons/common';
import { useSnack } from '@ndla/ui';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../../../components/AuthenticationContext';
import { GQLFolder } from '../../../graphqlTypes';
import {
  useUpdateFolderStatusMutation,
  useDeleteFolderMutation,
} from '../folderMutations';
import { OutletContext } from '../MyNdlaLayout';
import FolderCreateModal from './FolderCreateModal';
import FolderDeleteModal from './FolderDeleteModal';
import FolderEditModal from './FolderEditModal';
import FolderShareModal from './FolderShareModal';
import { buttonCss, iconCss } from './FoldersPage';
import { isStudent, copyFolderSharingLink } from './util';

interface FolderButtonProps {
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  selectedFolder: GQLFolder | null;
  folders: GQLFolder[];
}

const FolderButtons = ({
  setFocusId,
  selectedFolder,
  folders,
}: FolderButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { folderId } = useParams();
  const { addSnack } = useSnack();
  const { examLock, user } = useContext(AuthContext);
  const { setResetFocus } = useOutletContext<OutletContext>();

  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);

  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { deleteFolder } = useDeleteFolderMutation();
  const { setIsOpen } = useOutletContext<OutletContext>();

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
        setIsOpen(false);
      }
    },
    [addSnack, t, setIsOpen, setFocusId],
  );

  const onFolderUpdated = useCallback(() => {
    addSnack({ id: 'folderUpdated', content: t('myNdla.folder.updated') });
    setIsOpen(false);
  }, [addSnack, t, setIsOpen]);

  const onDeleteFolder = useCallback(async () => {
    if (selectedFolder) {
      await deleteFolder({ variables: { id: selectedFolder.id } });
      if (selectedFolder.id === folderId) {
        navigate(`/minndla/folders/${selectedFolder.parentId ?? ''}`, {
          replace: true,
        });
      }
      addSnack({
        id: 'folderDeleted',
        content: t('myNdla.folder.folderDeleted', {
          folderName: selectedFolder.name,
        }),
      });
      setIsOpen(false);
      const previousFolderId = folders.indexOf(selectedFolder) - 1;
      setFocusId(
        previousFolderId <= -1
          ? undefined
          : folders[previousFolderId]?.id ?? undefined,
      );
      if (folders.length - 1 <= 0) {
        setResetFocus(true);
      }
    }
  }, [
    addSnack,
    deleteFolder,
    folderId,
    navigate,
    selectedFolder,
    setResetFocus,
    t,
    setIsOpen,
    folders,
    setFocusId,
  ]);

  const toolbarButtons = useMemo(() => {
    const showAddButton =
      (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
    const showShareFolder = folderId !== null && !isStudent(user);
    const isFolderShared = selectedFolder?.status !== 'private';

    const sharedButton = selectedFolder && isFolderShared && (
      <FolderShareModal
        key="sharedFolderButton"
        type="shared"
        folder={selectedFolder}
        onUpdateStatus={async (close) => {
          close();
          unShareRef.current?.click();
          setIsOpen(false);
        }}
        onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
      >
        <ButtonV2
          css={buttonCss}
          colorTheme="lighter"
          variant="ghost"
          ref={previewRef}
        >
          <Share css={iconCss} />
          {t('myNdla.folder.sharing.button.share')}
        </ButtonV2>
      </FolderShareModal>
    );

    const unShareButton = selectedFolder && isFolderShared && (
      <FolderShareModal
        key="unShareFolderButton"
        type="unShare"
        folder={selectedFolder}
        onUpdateStatus={async (close) => {
          updateFolderStatus({
            variables: {
              folderId: selectedFolder.id,
              status: 'private',
            },
          }).then(() => setTimeout(() => shareRef.current?.focus(), 100));
          close();
          addSnack({
            id: 'sharingDeleted',
            content: t('myNdla.folder.sharing.unShare'),
          });
          setIsOpen(false);
        }}
      >
        <ButtonV2
          css={buttonCss}
          variant="ghost"
          colorTheme="lighter"
          ref={unShareRef}
        >
          <Cross css={iconCss} />
          {t('myNdla.folder.sharing.button.unShare')}
        </ButtonV2>
      </FolderShareModal>
    );

    const shareButton = selectedFolder && !isFolderShared && (
      <FolderShareModal
        key="shareFolderButton"
        type="private"
        folder={selectedFolder}
        onUpdateStatus={async (close) => {
          updateFolderStatus({
            variables: {
              folderId: selectedFolder.id,
              status: 'shared',
            },
          }).then(() => setTimeout(() => previewRef.current?.focus(), 100));
          close();
          addSnack({
            id: 'folderShared',
            content: t('myNdla.folder.sharing.header.shared'),
          });
          setIsOpen(false);
        }}
      >
        <ButtonV2
          css={buttonCss}
          variant="ghost"
          colorTheme="lighter"
          ref={shareRef}
        >
          <Share css={iconCss} />
          {t('myNdla.folder.sharing.share')}
        </ButtonV2>
      </FolderShareModal>
    );

    const addFolderButton = showAddButton && (
      <FolderCreateModal
        key="createFolderButton"
        onSaved={onFolderAdded}
        parentFolder={selectedFolder}
      />
    );

    const editFolderButton = selectedFolder && (
      <FolderEditModal
        key="editFolderButton"
        onSaved={onFolderUpdated}
        folder={selectedFolder}
      />
    );

    const deleteFolderButton = !!selectedFolder?.id && (
      <FolderDeleteModal
        key="deleteFolderButton"
        onDelete={onDeleteFolder}
        onClose={(e) => {
          if (folders.length - 1 <= 0) {
            e?.preventDefault();
            document.getElementById('titleAnnouncer')?.focus();
          }
        }}
      />
    );

    const copySharedFolderLink = selectedFolder && isFolderShared && (
      <ButtonV2
        key="copySharedLink"
        css={buttonCss}
        variant="ghost"
        colorTheme="lighter"
        onClick={() => {
          copyFolderSharingLink(selectedFolder.id);
          addSnack({
            id: 'folderLinkCopied',
            content: t('myNdla.folder.sharing.link'),
          });
        }}
      >
        <Copy css={iconCss} />
        {t('myNdla.folder.sharing.button.shareLink')}
      </ButtonV2>
    );

    if (!showShareFolder) {
      return [addFolderButton, editFolderButton, deleteFolderButton];
    }

    return [
      addFolderButton,
      editFolderButton,
      shareButton,
      sharedButton,
      unShareButton,
      copySharedFolderLink,
      deleteFolderButton,
    ];
  }, [
    folders.length,
    updateFolderStatus,
    onFolderUpdated,
    selectedFolder,
    onDeleteFolder,
    onFolderAdded,
    previewRef,
    unShareRef,
    setIsOpen,
    shareRef,
    addSnack,
    examLock,
    folderId,
    user,
    t,
  ]).filter(Boolean);

  return toolbarButtons;
};

export default FolderButtons;
