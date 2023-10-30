/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { useArenaUser } from '../arenaMutations';
import { FeideUserApiType } from '../../../interfaces';
import { parseUserObject } from './parseUserObject';

type AvatarProps = {
  myProfile?: boolean;
  user?: FeideUserApiType;
};

const StyledAvatarContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 48px;
  border: 1px solid ${colors.brand.tertiary};
  &[data-myProfile='true'] {
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
  &[data-myProfile='true'] {
    ${fonts.sizes('130px')};
  }
`;

function Avatar({ myProfile, user }: AvatarProps) {
  // const parsedUser = user && parseUserObject(user);
  const { arenaUser } = useArenaUser('jonas'); //error, loading,
  // regex to get user initials

  console.log(arenaUser);
  const initials = user?.displayName
    ?.match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)
    ?.join('')
    .toLocaleUpperCase();
  return (
    <StyledAvatarContainer data-myProfile={myProfile}>
      <UserInitials data-myProfile={myProfile}>{initials}</UserInitials>
    </StyledAvatarContainer>
  );
}

export default Avatar;
