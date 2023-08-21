/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ListResource, MessageBox, useSnack } from '@ndla/ui';
import { TFunction, useTranslation } from 'react-i18next';
import { useContext, useMemo, useState } from 'react';
import { ButtonV2 as Button, LoadingButton } from '@ndla/button';
import { GQLFolder } from '../../graphqlTypes';
import FolderSelect from './FolderSelect';
import {
  useCopySharedFolder,
  useFolders,
} from '../../containers/MyNdla/folderMutations';
import { AuthContext } from '../AuthenticationContext';
import { AddResourceContainer, ButtonRow } from './AddResourceToFolder';

interface Props {
  folder: GQLFolder;
  onClose: () => void;
}

export const baseSharedFolder = (t: TFunction) => ({
  id: 'shared-folder',
  name: t('myNdla.folder.sharing.sharedFolder'),
});

const CopyFolder = ({ folder, onClose }: Props) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );

  const { examLock } = useContext(AuthContext);
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const { folders, loading } = useFolders();
  const {
    copySharedFolder,
    loading: copySharedFolderLoading,
    error: copySharedFolderError,
  } = useCopySharedFolder();

  const onSave = async () => {
    await copySharedFolder({
      variables: {
        folderId: folder.id,
        destinationFolderId: selectedFolderId,
      },
    });
    onClose();
    addSnack({
      content: t('myNdla.sharedFolder.folderCopied'),
      id: 'sharedFolderCopied',
    });
  };

  const sharedFolder = useMemo(() => baseSharedFolder(t), [t]);

  return (
    <AddResourceContainer>
      <ListResource
        id={folder.id.toString()}
        link={`/folder/${folder.id}`}
        title={folder.name ?? ''}
        resourceTypes={[sharedFolder]}
        resourceImage={{
          src: '',
          alt: '',
        }}
      />
      {examLock ? (
        <MessageBox>{t('myNdla.examLockInfo')}</MessageBox>
      ) : (
        <>
          <FolderSelect
            folders={folders}
            loading={loading}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
          />
          <MessageBox>{t('myNdla.copyFolderDisclaimer')}</MessageBox>
          {copySharedFolderError && (
            <MessageBox type="danger">
              {t('errorMessage.description')}
            </MessageBox>
          )}
        </>
      )}
      <ButtonRow>
        <Button variant="outline" onClick={onClose}>
          {t('cancel')}
        </Button>
        <LoadingButton
          loading={copySharedFolderLoading}
          colorTheme="light"
          disabled={examLock || copySharedFolderLoading}
          onClick={onSave}
        >
          {t('myNdla.resource.save')}
        </LoadingButton>
      </ButtonRow>
    </AddResourceContainer>
  );
};

export default CopyFolder;
