/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle, Modal, ModalTrigger, ModalContent } from '@ndla/modal';
import { ListResource } from '@ndla/ui';
import AddResourceToFolder, { ResourceAttributes } from './AddResourceToFolder';
import LoginModalContent from './LoginModalContent';
import { useFolderResourceMeta } from '../../containers/MyNdla/folderMutations';
import { GQLFolder } from '../../graphqlTypes';
import { AuthContext } from '../AuthenticationContext';

interface Props {
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
  children: ReactNode;
}

const AddResourceToFolderModal = ({ resource, children, defaultOpenFolder }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { meta, loading } = useFolderResourceMeta(resource, {
    skip: !resource,
  });

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onOpenChange={setOpen} modal={!authenticated}>
      <ModalTrigger>{children}</ModalTrigger>
      {authenticated ? (
        <ModalContent forceOverlay>
          <ModalHeader>
            <ModalTitle>{t('myNdla.resource.addToMyNdla')}</ModalTitle>
            <ModalCloseButton title={t('modal.closeModal')} />
          </ModalHeader>
          <ModalBody>
            <AddResourceToFolder onClose={close} resource={resource} defaultOpenFolder={defaultOpenFolder} />
          </ModalBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t('myNdla.myPage.loginResourcePitch')}
          content={
            resource && (
              <ListResource
                isLoading={loading}
                id={resource.id.toString()}
                tagLinkPrefix="/minndla/tags"
                link={resource.path}
                title={meta?.title ?? ''}
                resourceImage={{
                  src: meta?.metaImage?.url ?? '',
                  alt: meta?.metaImage?.alt ?? '',
                }}
                resourceTypes={meta?.resourceTypes ?? []}
              />
            )
          }
        />
      )}
    </Modal>
  );
};

interface ContentProps {
  close: VoidFunction;
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
}

export const AddResourceToFolderModalContent = ({ resource, defaultOpenFolder, close }: ContentProps) => {
  const { t } = useTranslation();
  return (
    <ModalContent forceOverlay>
      <ModalHeader>
        <ModalTitle>{t('myNdla.resource.addToMyNdla')}</ModalTitle>
        <ModalCloseButton title={t('modal.closeModal')} />
      </ModalHeader>
      <ModalBody>
        <AddResourceToFolder onClose={close} resource={resource} defaultOpenFolder={defaultOpenFolder} />
      </ModalBody>
    </ModalContent>
  );
};

export default AddResourceToFolderModal;
