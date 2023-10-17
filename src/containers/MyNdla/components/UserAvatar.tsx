/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { fonts, colors, breakpoints, mq } from '@ndla/core';
import EditProfilePicture from '../MyProfile/components/EditProfilePicture';

type UserAvatarProps = {
  hasUploadedAvatar: boolean;
  userName: string | undefined;
  showProfileButton?: boolean;
};

const UserAvatarContainer = styled.div`
  position: relative;
`;

const StyledUserAvatarWrapper = styled.div<UserAvatarProps>`
  width: 250px;
  height: 250px;
  ${({ hasUploadedAvatar }) =>
    hasUploadedAvatar
      ? css`
          border-radius: 249px;
          border: 1px solid ${colors.brand.tertiary};
        `
      : css`
          border-radius: 246px;
          border: 4px solid ${colors.brand.tertiary};
        `};
  background-color: ${colors.background.default};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserInitials = styled.div`
  ${fonts.sizes('130px', '24px')};
  color: ${colors.brand.dark};
`;

const DesktopButtonContainer = styled.div`
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    position: absolute;
    bottom: 0px;
    left: 125px;
  }
`;

const UserAvatar = ({
  hasUploadedAvatar,
  userName,
  showProfileButton,
}: UserAvatarProps) => {
  // regex to get user initials
  const initials = userName
    ?.match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)
    ?.join('')
    .toLocaleUpperCase();

  return (
    <UserAvatarContainer>
      <StyledUserAvatarWrapper
        hasUploadedAvatar={hasUploadedAvatar}
        userName={userName}
      >
        <UserInitials>{initials}</UserInitials>
      </StyledUserAvatarWrapper>
      {showProfileButton && (
        <DesktopButtonContainer>
          <EditProfilePicture />
        </DesktopButtonContainer>
      )}
    </UserAvatarContainer>
  );
};

export default UserAvatar;
