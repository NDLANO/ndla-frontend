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
import EditProfilePicture from './EditProfilePicture';

type UserAvatarProps = {
  hasUploadedAvatar: boolean;
};

const StyledUserAvatarContainer = styled.div<UserAvatarProps>`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  ${({ hasUploadedAvatar }) =>
    hasUploadedAvatar
      ? css`
          border: 1px solid ${colors.brand.tertiary};
        `
      : css`
          border: 4px solid ${colors.brand.tertiary};
        `};
  background-color: ${colors.background.default};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const StyledUserInitials = styled.div`
  ${fonts.sizes('130px', '24px')};
  color: ${colors.brand.dark};
`;

const StyledDesktopButtonContainer = styled.div`
  ${mq.range({ until: breakpoints.tabletWide })} {
    display: none;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    position: absolute;
    bottom: 0px;
    left: 125px;
  }
`;

const UserAvatar = ({ hasUploadedAvatar }: UserAvatarProps) => {
  return (
    <StyledUserAvatarContainer hasUploadedAvatar={hasUploadedAvatar}>
      <StyledUserInitials>UA</StyledUserInitials>
      {/* Check for path to display the button. Only show in My Profile to make component generic */}
      <StyledDesktopButtonContainer>
        <EditProfilePicture />
      </StyledDesktopButtonContainer>
    </StyledUserAvatarContainer>
  );
};

export default UserAvatar;
