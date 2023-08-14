/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListResource } from '@ndla/ui';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { AuthContext } from '../AuthenticationContext';
import { GQLFolder } from '../../graphqlTypes';
import LoginModalContent from './LoginModalContent';
import CopyFolder, { baseSharedFolder } from './CopyFolder';

interface Props {
  folder: GQLFolder;
  children: ReactNode;
}

const CopyFolderModal = ({ folder, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  const close = useCallback(() => setOpen(false), []);

  const sharedFolder = baseSharedFolder(t);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>{children}</ModalTrigger>
      {authenticated ? (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t('myNdla.resource.copyToMyNdla')}</ModalTitle>
            <ModalCloseButton title={t('modal.closeModal')} />
          </ModalHeader>
          <ModalBody>
            <CopyFolder folder={folder} onClose={close} />
          </ModalBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t('myNdla.loginCopyFolderPitch')}
          content={
            folder && (
              <ListResource
                id={folder.id.toString()}
                link={`/folder/${folder.id}`}
                title={folder.name ?? ''}
                resourceImage={{
                  src: '',
                  alt: '',
                }}
                resourceTypes={[sharedFolder]}
              />
            )
          }
        />
      )}
    </Modal>
  );
};

export default CopyFolderModal;
