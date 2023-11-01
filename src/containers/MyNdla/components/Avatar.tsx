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
import { useMemo } from 'react';
import { useArenaUser } from '../arenaQueries';

type AvatarProps = {
  myProfile?: boolean;
  displayName: string | undefined;
  userId: string | undefined;
};

const StyledAvatarContainer = styled.div`
  width: ${spacing.large};
  height: ${spacing.large};
  border-radius: 50%;
  border: 1px solid ${colors.brand.tertiary};
  &[data-myprofile='true'] {
    width: 250px;
    height: 250px;
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
  border-radius: 50%;
`;

export const getFirstLastInitials = (userName: string | undefined) => {
  // a function to split up displayName, get the initials of first and last names and merge them
  return userName
    ?.split(' ')
    .map((value, index, array) =>
      index === 0 || index + 1 === array.length ? value.at(0) : null,
    )
    .join('');
};

function Avatar({ myProfile, displayName, userId }: AvatarProps) {
  const { t } = useTranslation();
  const { arenaUser } = useArenaUser(userId ?? '');
  const initials = useMemo(
    () => getFirstLastInitials(displayName),
    [displayName],
  );

  return (
    <StyledAvatarContainer data-myprofile={myProfile}>
      {arenaUser?.profilePicture ? (
        <UserPersonalPicture
          src={arenaUser.profilePicture}
          alt={t('myNdla.userPictureAltText')}
        />
      ) : (
        <UserInitials data-myprofile={myProfile}>{initials}</UserInitials>
      )}
    </StyledAvatarContainer>
  );
}

export default Avatar;
