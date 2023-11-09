/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import Icon from '@ndla/icons';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import { useState } from 'react';
import { spacing } from '@ndla/core';
import { Modal, ModalTrigger } from '@ndla/modal';
import UploadModalContent from './UploadModalContent';

const StyledChangeAvatarButton = styled(ButtonV2)`
  height: 42px;
  gap: ${spacing.xsmall};
  white-space: nowrap;
`;

const StyledPencilSvg = styled(Icon)`
  width: ${spacing.normal};
  height: ${spacing.normal};
`;

const PencilIcon = StyledPencilSvg.withComponent(Pencil);

const EditProfilePicture = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Modal open={showModal} onOpenChange={setShowModal}>
      <ModalTrigger>
        <StyledChangeAvatarButton
          colorTheme="primary"
          onClick={() => setShowModal(!showModal)}
        >
          <PencilIcon />
          {t('myNdla.myProfile.editButtonText')}
          <UploadModalContent />
        </StyledChangeAvatarButton>
      </ModalTrigger>
    </Modal>
  );
};

export default EditProfilePicture;
