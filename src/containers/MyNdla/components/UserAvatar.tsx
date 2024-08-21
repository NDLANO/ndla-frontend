/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import Avatar from "./Avatar";
import EditProfilePicture from "../MyProfile/components/EditProfilePicture";

type UserAvatarProps = {
  userName: string | undefined;
  showProfileButton?: boolean;
};

const UserAvatarContainer = styled("div", {
  base: {
    position: "relative",
  },
});

const DesktopButtonContainer = styled("div", {
  base: {
    bottom: "unset",
    display: "none",
    left: "unset",
    position: "unset",
    tablet: {
      bottom: "0",
      display: "block",
      left: "50%",
      position: "absolute",
    },
  },
});

const UserAvatar = ({ userName, showProfileButton }: UserAvatarProps) => {
  const profilePicture = undefined;
  return (
    <UserAvatarContainer>
      <Avatar aria-hidden={!profilePicture} displayName={userName} myProfile profilePicture={profilePicture} />
      {/* TODO: Will never be visible */}
      {showProfileButton && (
        <DesktopButtonContainer>
          <EditProfilePicture />
        </DesktopButtonContainer>
      )}
    </UserAvatarContainer>
  );
};

export default UserAvatar;
