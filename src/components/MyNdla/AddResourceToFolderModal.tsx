/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ListResource } from '@ndla/ui';
import { ModalBody, ModalCloseButton, ModalHeader, ModalV2 } from '@ndla/modal';
import AddResourceToFolder, { ResourceAttributes } from './AddResourceToFolder';
import { AuthContext } from '../AuthenticationContext';
import { useFolderResourceMeta } from '../../containers/MyNdla/folderMutations';
import { GQLFolder } from '../../graphqlTypes';
import LoginModal from './LoginModal';

interface Props {
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
  isOpen: boolean;
  onClose: () => void;
}

const AddResourceToFolderModal = ({
  isOpen,
  onClose,
  resource,
  defaultOpenFolder,
}: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { meta, loading } = useFolderResourceMeta(resource, {
    skip: !resource,
  });

  if (authenticated) {
    return (
      <ModalV2
        controlled
        isOpen={isOpen}
        size="normal"
        onClose={onClose}
        label={t('myNdla.resource.addToMyNdla')}
      >
        {onCloseModal => (
          <>
            <ModalHeader>
              <h1>{t('myNdla.resource.addToMyNdla')}</h1>
              <ModalCloseButton
                onMouseDown={e => e.preventDefault()}
                onMouseUp={e => e.preventDefault()}
                title={t('modal.closeModal')}
                onClick={onCloseModal}
              />
            </ModalHeader>
            <ModalBody>
              <AddResourceToFolder
                resource={resource}
                onClose={onClose}
                defaultOpenFolder={defaultOpenFolder}
              />
            </ModalBody>
          </>
        )}
      </ModalV2>
    );
  } else {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={onClose}
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
    );
  }
};

export default AddResourceToFolderModal;
