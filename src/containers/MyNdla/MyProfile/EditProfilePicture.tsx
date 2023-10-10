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

const StyledChangeAvatarButton = styled(ButtonV2)`
  min-width: 172px;
  height: 42px;
`;

const StyledPencilSvg = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const PencilIcon = StyledPencilSvg.withComponent(Pencil);

function EditProfilePicture() {
  const { t } = useTranslation();

  return (
    <StyledChangeAvatarButton colorTheme="primary">
      <PencilIcon />
      {t('myndla.myProfile.editButtonText')}
    </StyledChangeAvatarButton>
  );
}

export default EditProfilePicture;
