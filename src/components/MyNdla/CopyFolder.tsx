/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonV2 as Button, LoadingButton } from '@ndla/button';
import { InformationOutline, WarningOutline } from '@ndla/icons/common';
import { Folder, MessageBox, useSnack } from '@ndla/ui';
import { AddResourceContainer, ButtonRow } from './AddResourceToFolder';
import FolderSelect from './FolderSelect';
import { useCopySharedFolderMutation, useFolders } from '../../containers/MyNdla/folderMutations';
import { GQLFolder } from '../../graphqlTypes';
import { getTotalCountForFolder } from '../../util/folderHelpers';
import { AuthContext } from '../AuthenticationContext';

interface Props {
  folder: GQLFolder;
  onClose: () => void;
}

const CopyFolder = ({ folder, onClose }: Props) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  const { examLock } = useContext(AuthContext);
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const { folders, loading } = useFolders();
  const copySharedFolderMutation = useCopySharedFolderMutation();
  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  const onSave = async () => {
    await copySharedFolderMutation.copySharedFolder({
      variables: {
        folderId: folder.id,
        destinationFolderId: selectedFolderId === 'folders' ? undefined : selectedFolderId,
      },
    });
    onClose();
    addSnack({
      content: t('myNdla.sharedFolder.folderCopied'),
      id: 'sharedFolderCopied',
    });
  };

  return (
    <AddResourceContainer>
      <Folder
        id={folder.id.toString()}
        title={folder.name ?? ''}
        link={`/folder/${folder.id}`}
        isShared={true}
        subFolders={folderCount.folders}
        subResources={folderCount.resources}
      />
      {examLock ? (
        <MessageBox>
          <InformationOutline />
          {t('myNdla.examLockInfo')}
        </MessageBox>
      ) : (
        <>
          <FolderSelect
            folders={folders}
            loading={loading}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
          />
          <MessageBox>
            <InformationOutline />
            {t('myNdla.copyFolderDisclaimer')}
          </MessageBox>
          {copySharedFolderMutation.error && (
            <MessageBox type="danger">
              <WarningOutline />
              {t('errorMessage.description')}
            </MessageBox>
          )}
        </>
      )}
      <ButtonRow>
        <Button
          variant="outline"
          onClick={onClose}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          loading={copySharedFolderMutation.loading}
          colorTheme="light"
          disabled={examLock || copySharedFolderMutation.loading}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
          onClick={onSave}
        >
          {t('myNdla.resource.save')}
        </LoadingButton>
      </ButtonRow>
    </AddResourceContainer>
  );
};

export default CopyFolder;
