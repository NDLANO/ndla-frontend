/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useArenaUser } from '../arenaMutations';
import { FeideUserApiType } from '../../../interfaces';

type AvatarProps = {
  myProfile?: boolean;
  user: FeideUserApiType | undefined;
};

const StyledAvatarContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 48px;
  border: 1px solid ${colors.brand.tertiary};
  &[data-myprofile='true'] {
    width: 250px;
    height: 250px;
    border-radius: 246px;
    border: 4px solid ${colors.brand.tertiary};
  }
  background-color: ${colors.background.default};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserInitials = styled.div`
  ${fonts.sizes('24px')};
  color: ${colors.brand.dark};
  &[data-myprofile='true'] {
    ${fonts.sizes('130px')};
  }
`;

const UserPersonalPicture = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 48px;
  &[data-myprofile='true'] {
    border-radius: 246px;
  }
`;

function Avatar({ myProfile, user }: AvatarProps) {
  const { t } = useTranslation();
  const { arenaUser } = useArenaUser(user?.uid.at(0) ?? '');

  // regex to get user initials
  const initials = user?.displayName
    ?.match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)
    ?.join('')
    .toLocaleUpperCase();
  return (
    <StyledAvatarContainer data-myprofile={myProfile}>
      <UserInitials data-myprofile={myProfile}>
        {arenaUser?.profilePicture ? (
          <UserPersonalPicture
            data-myprofile={myProfile}
            src={arenaUser.profilePicture}
            alt={t('myNdla.userPictureAltText')}
          />
        ) : (
          initials
        )}
      </UserInitials>
    </StyledAvatarContainer>
  );
}

export default Avatar;
