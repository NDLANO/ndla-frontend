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
import { useRef, useState } from 'react';

const StyledChangeAvatarButton = styled(ButtonV2)`
  height: 42px;
  gap: 8px;
  white-space: nowrap;
`;

const StyledPencilSvg = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const PencilIcon = StyledPencilSvg.withComponent(Pencil);

function EditProfilePicture() {
  const { t } = useTranslation();
  const [_profilePicture, setProfilePicture] = useState<string | null>();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: any) {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <StyledChangeAvatarButton
        colorTheme="primary"
        onClick={() => fileRef.current?.click()}
      >
        <PencilIcon />
        {t('myNdla.myProfile.editButtonText')}
      </StyledChangeAvatarButton>
      <input
        type="file"
        accept="image/*"
        hidden
        multiple={false}
        onChange={handleChange}
        ref={fileRef}
      />
    </>
  );
}

export default EditProfilePicture;
