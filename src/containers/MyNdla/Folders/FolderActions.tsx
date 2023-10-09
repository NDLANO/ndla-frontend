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
import { useCallback, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnack } from '@ndla/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { GQLFolder } from '../../../graphqlTypes';
import { ViewType } from './FoldersPage';
import { AuthContext } from '../../../components/AuthenticationContext';
import { copyFolderSharingLink, isStudent } from './util';
import { MenuItemProps } from '../components/SettingsMenu';
import FolderMenu from '../components/FolderMenu';
import { FolderShareModalContent } from './FolderShareModal';
import {
  useAddFolderMutation,
  useDeleteFolderMutation,
  useUpdateFolderStatusMutation,
} from '../folderMutations';
import config from '../../../config';
import { FolderFormValues } from './FolderForm';
import { CreateModalContent } from './FolderCreateModal';
import { DeleteModalContent } from './FolderDeleteModal';
import { EditFolderModalContent } from './FolderEditModal';
import { concat } from 'lodash';

interface Props {
  selectedFolder: GQLFolder | null;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  inToolbar?: boolean;
}

const FolderActions = ({
  selectedFolder,
  viewType,
  onViewTypeChange,
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
          parentId: selectedFolder?.parentId ?? undefined,
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
      }
    },
    [addSnack, t, selectedFolder?.parentId, addFolder],
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
    }
  }, [addSnack, deleteFolder, folderId, navigate, selectedFolder, t]);

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];

    const addFolderButton: MenuItemProps = {
      icon: <Plus />,
      text: t('myNdla.newFolder'),
      isModal: true,
      modalContent: (close) => (
        <CreateModalContent
          folders={selectedFolder?.subfolders}
          parentFolder={selectedFolder}
          onCreate={onFolderAdded}
          onClose={close}
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
        />
      ),
    };

    const actions = [];

    if (inToolbar) {
      actions.push(addFolderButton);
    }

    if (isStudent(user)) {
      return concat(actions, [editFolder, deleteOpt]);
    }

    if (selectedFolder.status === 'shared') {
      return concat(actions, [
        editFolder,
        shareLink,
        copyLink,
        unShare,
        deleteOpt,
      ]);
    }

    return concat(actions, [editFolder, share, deleteOpt]);
  }, [
    addSnack,
    examLock,
    onFolderAdded,
    onDeleteFolder,
    onFolderUpdated,
    selectedFolder,
    updateFolderStatus,
    user,
    t,
  ]);

  return (
    <FolderMenu
      menuItems={actionItems}
      viewType={viewType}
      onViewTypeChange={onViewTypeChange}
    />
  );
};

export default FolderActions;
