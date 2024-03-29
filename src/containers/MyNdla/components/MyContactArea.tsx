/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { colors, spacing, breakpoints, mq } from "@ndla/core";
import { Heading } from "@ndla/typography";
import UserAvatar from "./UserAvatar";
import { isStudent, withRole } from "../Folders/util";
import EditProfilePicture from "../MyProfile/components/EditProfilePicture";

type UserProp = {
  username?: string;
  displayName?: string;
  primaryOrg?: string;
  role?: string;
};

type MyContractAreaProps = {
  user: UserProp;
  showProfileButton?: boolean;
};

const MyContactAreaContainer = styled.div`
  max-width: 100%;
  max-height: fit-content;
  padding: ${spacing.large} 0;
  border: 1px solid ${colors.brand.lighter};
  border-radius: ${spacing.small};
  background-color: ${colors.background.lightBlue};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.small};
`;

const AvatarContainer = styled.div`
  max-width: 250px;
  max-height: 250px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const UserWorkPlaceText = styled(Heading)`
  color: ${colors.brand.primary};
`;

const MobileButtonContainer = styled.div`
  padding-top: ${spacing.xxsmall};
  ${mq.range({ from: breakpoints.tablet })} {
    display: none;
  }
`;

const MyContactArea = ({ user, showProfileButton }: MyContractAreaProps) => {
  return (
    <MyContactAreaContainer>
      {!isStudent(user as withRole) && (
        <AvatarContainer>
          <UserAvatar userName={user.displayName} />
        </AvatarContainer>
      )}
      <Heading element="h2" id="userName" margin="none" headingStyle="h2">
        {user.displayName}
      </Heading>
      <UserInfoContainer>
        <UserWorkPlaceText element="p" headingStyle="list-title" margin="none">
          {user.primaryOrg}
        </UserWorkPlaceText>
      </UserInfoContainer>
      {showProfileButton && (
        <>
          {!isStudent(user as withRole) && (
            <MobileButtonContainer>
              <EditProfilePicture />
            </MobileButtonContainer>
          )}
        </>
      )}
    </MyContactAreaContainer>
  );
};
export default MyContactArea;
