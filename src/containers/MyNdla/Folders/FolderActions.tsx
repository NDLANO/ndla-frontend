/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Cross, Pencil, Plus } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Link, Share } from '@ndla/icons/common';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSnack } from '@ndla/ui';
import { useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { GQLFolder } from '../../../graphqlTypes';
import { AuthContext } from '../../../components/AuthenticationContext';
import { copyFolderSharingLink, isStudent } from './util';
import SettingsMenu, { MenuItemProps } from '../components/SettingsMenu';
import { FolderShareModalContent } from './FolderShareModal';
import {
  useAddFolderMutation,
  useDeleteFolderMutation,
  useUpdateFolderStatusMutation,
} from '../folderMutations';
import config from '../../../config';
import { FolderFormValues } from './FolderForm';
import { CreateModalContent } from './FolderCreateModal';
import { EditFolderModalContent } from './FolderEditModal';
import DeleteModalContent from '../components/DeleteModalContent';

interface Props {
  selectedFolder: GQLFolder | null;
  inToolbar?: boolean;
  setFocusId: Dispatch<SetStateAction<string | undefined>>;
  previousFolders?: GQLFolder[];
  folders: GQLFolder[];
}

const FolderActions = ({
  selectedFolder,
  setFocusId,
  folders,
  previousFolders,
  inToolbar = false,
}: Props) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const { folderId } = useParams();
  const navigate = useNavigate();

  const { updateFolderStatus } = useUpdateFolderStatusMutation();
  const { deleteFolder } = useDeleteFolderMutation();
  const { addFolder } = useAddFolderMutation();

  const { user, examLock } = useContext(AuthContext);
  const shareRef = useRef<HTMLButtonElement | null>(null);
  const unShareRef = useRef<HTMLButtonElement | null>(null);
  const previewRef = useRef<HTMLButtonElement | null>(null);

  const onFolderUpdated = useCallback(() => {
    addSnack({ id: 'folderUpdated', content: t('myNdla.folder.updated') });
  }, [addSnack, t]);

  const onFolderAdded = useCallback(
    async (values: FolderFormValues) => {
      const res = await addFolder({
        variables: {
          name: values.name,
          description: values.description,
          parentId: inToolbar
            ? folderId
            : selectedFolder?.parentId ?? undefined,
        },
      });
      const folder = res.data?.addFolder as GQLFolder | undefined;

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
    [
      selectedFolder?.parentId,
      setFocusId,
      inToolbar,
      addFolder,
      addSnack,
      folderId,
      t,
    ],
  );

  const onDeleteFolder = useCallback(async () => {
    if (selectedFolder) {
      await deleteFolder({ variables: { id: selectedFolder.id } });
      if (selectedFolder?.id === folderId) {
        navigate(`/minndla/folders/${selectedFolder.parentId}`, {
          replace: true,
        });
      }
      addSnack({
        id: 'folderDeleted',
        content: t('myNdla.folder.folderDeleted', {
          folderName: selectedFolder.name,
        }),
      });
      const previousFolderId = folders.indexOf(selectedFolder) - 1;
      setFocusId(
        inToolbar || previousFolderId === -1
          ? undefined
          : folders[previousFolderId]?.id ?? undefined,
      );
    }
  }, [
    selectedFolder,
    deleteFolder,
    setFocusId,
    inToolbar,
    addSnack,
    folderId,
    navigate,
    folders,
    t,
  ]);

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];

    const addFolderButton: MenuItemProps = {
      icon: <Plus />,
      text: t('myNdla.newFolder'),
      isModal: true,
      modalContent: (close, setFocus) => (
        <CreateModalContent
          onClose={close}
          folders={selectedFolder?.subfolders}
          parentFolder={selectedFolder}
          onCreate={onFolderAdded}
          skipAutoFocus={setFocus}
        />
      ),
    };

    if (!selectedFolder) return [addFolderButton];

    const editFolder: MenuItemProps = {
      icon: <Pencil />,
      text: t('myNdla.folder.edit'),
      isModal: true,
      modalContent: (close) => (
        <EditFolderModalContent
          onClose={close}
          onSaved={onFolderUpdated}
          folder={selectedFolder}
        />
      ),
    };

    const shareLink: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.button.share'),
      ref: previewRef,
      isModal: true,
      keepOpen: true,
      modalContent: (close) => (
        <FolderShareModalContent
          type="shared"
          folder={selectedFolder}
          onClose={close}
          onCopyText={() => copyFolderSharingLink(selectedFolder.id)}
          onUpdateStatus={async (close) => {
            close();
            unShareRef.current?.click();
          }}
        />
      ),
    };

    const copyLink: MenuItemProps = {
      icon: <Link />,
      text: t('myNdla.folder.sharing.copyLink'),
      onClick: () => {
        navigator.clipboard.writeText(
          `${config.ndlaFrontendDomain}/folder/${selectedFolder.id}`,
        );
        addSnack({
          content: t('myNdla.resource.linkCopied'),
          id: 'linkCopied',
        });
      },
    };

    const unShare: MenuItemProps = {
      icon: <Cross />,
      text: t('myNdla.folder.sharing.button.unShare'),
      isModal: true,
      ref: unShareRef,
      modalContent: (close) => (
        <FolderShareModalContent
          type="unShare"
          folder={selectedFolder}
          onClose={close}
          onUpdateStatus={async (close) => {
            updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: 'private',
              },
            });
            close();
            addSnack({
              id: 'sharingDeleted',
              content: t('myNdla.folder.sharing.unShare'),
            });
          }}
        />
      ),
    };

    const share: MenuItemProps = {
      icon: <Share />,
      text: t('myNdla.folder.sharing.share'),
      isModal: true,
      ref: shareRef,
      modalContent: (close) => (
        <FolderShareModalContent
          type="private"
          folder={selectedFolder}
          onClose={close}
          onUpdateStatus={async (close) => {
            await updateFolderStatus({
              variables: {
                folderId: selectedFolder.id,
                status: 'shared',
              },
            });
            close();
            addSnack({
              id: 'folderShared',
              content: t('myNdla.folder.sharing.header.shared'),
            });
          }}
        />
      ),
    };

    const deleteOpt: MenuItemProps = {
      icon: <DeleteForever />,
      text: t('myNdla.folder.delete'),
      type: 'danger',
      isModal: true,
      modalContent: (close) => (
        <DeleteModalContent
          title={t('myNdla.folder.delete')}
          description={t('myNdla.confirmDeleteFolder')}
          removeText={t('myNdla.folder.delete')}
          onDelete={async () => {
            await onDeleteFolder();
            close();
          }}
          onClose={close}
        />
      ),
    };

    const actions = [];

    if (inToolbar) {
      actions.push(addFolderButton);
    }

    if (isStudent(user)) {
      return actions.concat(editFolder, deleteOpt);
    }

    if (selectedFolder.status === 'shared') {
      return actions.concat(
        editFolder,
        shareLink,
        copyLink,
        unShare,
        deleteOpt,
      );
    }

    return actions.concat(editFolder, share, deleteOpt);
  }, [
    updateFolderStatus,
    onFolderUpdated,
    onDeleteFolder,
    selectedFolder,
    onFolderAdded,
    inToolbar,
    examLock,
    addSnack,
    user,
    t,
  ]);

  return (
    <SettingsMenu
      menuItems={actionItems}
      isLastFolder={
        folders.length === 1 &&
        previousFolders?.length !== 1 &&
        isEqual(previousFolders, folders)
      }
    />
  );
};

export default FolderActions;
