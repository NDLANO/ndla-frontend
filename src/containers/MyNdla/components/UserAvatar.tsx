/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { breakpoints, misc, mq } from "@ndla/core";
import Avatar from "./Avatar";
import EditProfilePicture from "../MyProfile/components/EditProfilePicture";

type UserAvatarProps = {
  userName: string | undefined;
  showProfileButton?: boolean;
};

const UserAvatarContainer = styled.div`
  position: relative;
`;

const DesktopButtonContainer = styled.div`
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    position: absolute;
    bottom: 0px;
    left: ${misc.borderRadiusLarge};
  }
`;

const UserAvatar = ({ userName, showProfileButton }: UserAvatarProps) => {
  return (
    <UserAvatarContainer>
      <Avatar displayName={userName} myProfile profilePicture={undefined} />
      {showProfileButton && (
        <DesktopButtonContainer>
          <EditProfilePicture />
        </DesktopButtonContainer>
      )}
    </UserAvatarContainer>
  );
};

export default UserAvatar;
