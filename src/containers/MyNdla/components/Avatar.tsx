/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useArenaUser } from '../arenaQueries';
import { FeideUserApiType } from '../../../interfaces';

type AvatarProps = {
  myProfile?: boolean;
  user: FeideUserApiType | undefined;
};

const StyledAvatarContainer = styled.div`
  width: ${spacing.large};
  height: ${spacing.large};
  border-radius: 50%;
  border: 1px solid ${colors.brand.tertiary};
  &[data-myprofile='true'] {
    width: 250px;
    height: 250px;
    border-radius: 50%;
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

export const userInitials = (name: string | undefined) => {
  return name
    ?.split(' ')
    .map((n, i, a) => (i === 0 || i + 1 === a.length ? n.at(0) : null))
    .join('');
};

function Avatar({ myProfile, user }: AvatarProps) {
  const { t } = useTranslation();
  const { arenaUser } = useArenaUser(user?.uid.at(0) ?? '');

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
          userInitials(user?.displayName)
        )}
      </UserInitials>
    </StyledAvatarContainer>
  );
}

export default Avatar;
