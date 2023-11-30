/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { Cross, Copy } from '@ndla/icons/action';
import { Share, ShareArrow } from '@ndla/icons/common';
import { useSnack } from '@ndla/ui';
import { SafeLinkButton } from '@ndla/safelink';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useCallback,
  memo,
  useState,
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
import { isStudent, copyFolderSharingLink, previewLink } from './util';

interface FolderButtonProps {
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  selectedFolder: GQLFolder | null;
  setAmountOfButtons: Dispatch<SetStateAction<number>>;
}

const FolderButtons = ({
  setFocusId,
  selectedFolder,
  setAmountOfButtons,
}: FolderButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { folderId } = useParams();
  const { addSnack } = useSnack();
  const { examLock, user } = useContext(AuthContext);
  const { setResetFocus, setIsOpen } = useOutletContext<OutletContext>();

  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);

  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { deleteFolder } = useDeleteFolderMutation();

  const [preventDefault, setPreventDefault] = useState(false);

  const onFolderAdded = useCallback(
    (folder?: GQLFolder) => {
      if (!folder) {
        return;
      }
      addSnack({
        id: 'folderAdded',
        content: t('myNdla.folder.folderCreated', {
          folderName: folder.name,
        }),
      });
      setFocusId(folder.id);
      setIsOpen(false);
      setResetFocus(true);
    },
    [addSnack, t, setIsOpen, setFocusId, setResetFocus],
  );

  const onFolderUpdated = useCallback(() => {
    addSnack({ id: 'folderUpdated', content: t('myNdla.folder.updated') });
    setIsOpen(false);
  }, [addSnack, t, setIsOpen]);

  const onDeleteFolder = useCallback(async () => {
    if (!selectedFolder) {
      return;
    }

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
    setResetFocus(true);
    setIsOpen(false);
    setPreventDefault(true);
  }, [
    addSnack,
    deleteFolder,
    folderId,
    navigate,
    selectedFolder,
    t,
    setResetFocus,
    setIsOpen,
    setPreventDefault,
  ]);

  const showAddButton =
    (selectedFolder?.breadcrumbs.length || 0) < 5 && !examLock;
  const showShareFolder = folderId !== null && !isStudent(user);
  const isFolderShared = selectedFolder?.status !== 'private';

  const sharedButton =
    selectedFolder && isFolderShared ? (
      <FolderShareModal
        key="sharedFolderButton"
        type="shared"
        folder={selectedFolder}
        onUpdateStatus={async (close) => {
          close();
          unShareRef.current?.click();
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
    ) : null;

  const unShareButton =
    selectedFolder && isFolderShared ? (
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
          }).then(() => setTimeout(() => shareRef.current?.focus(), 0));
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
    ) : null;

  const shareButton =
    selectedFolder && !isFolderShared ? (
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
          }).then(() => setTimeout(() => previewRef.current?.focus(), 0));
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
    ) : null;

  const addFolderButton = showAddButton ? (
    <FolderCreateModal
      key="createFolderButton"
      onSaved={onFolderAdded}
      parentFolder={selectedFolder}
    />
  ) : null;

  const editFolderButton = selectedFolder ? (
    <FolderEditModal
      key="editFolderButton"
      onSaved={onFolderUpdated}
      folder={selectedFolder}
    />
  ) : null;

  const deleteFolderButton = selectedFolder?.id ? (
    <FolderDeleteModal
      key="deleteFolderButton"
      onDelete={onDeleteFolder}
      onClose={(e) => {
        if (preventDefault) {
          e?.preventDefault();
          document.getElementById('titleAnnouncer')?.focus();
          setPreventDefault(false);
        }
      }}
    />
  ) : null;

  const copySharedFolderLink =
    selectedFolder && isFolderShared ? (
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
          setIsOpen(false);
        }}
      >
        <Copy css={iconCss} />
        {t('myNdla.folder.sharing.button.shareLink')}
      </ButtonV2>
    ) : null;

  const previewFolderButton = selectedFolder ? (
    <SafeLinkButton
      key="previewFolder"
      css={buttonCss}
      variant="ghost"
      colorTheme="lighter"
      to={previewLink(selectedFolder.id)}
    >
      <ShareArrow css={iconCss} />
      {t(`myNdla.folder.sharing.button.${isFolderShared ? 'goTo' : 'preview'}`)}
    </SafeLinkButton>
  ) : null;

  if (!showShareFolder) {
    const buttons = [addFolderButton, editFolderButton, deleteFolderButton];
    setAmountOfButtons(buttons.filter(Boolean).length);
    return buttons;
  }
  const buttons = [
    addFolderButton,
    editFolderButton,
    shareButton,
    sharedButton,
    previewFolderButton,
    copySharedFolderLink,
    unShareButton,
    deleteFolderButton,
  ];
  setAmountOfButtons(buttons.filter(Boolean).length);
  return buttons;
};

export default memo(FolderButtons);
