/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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

const MyContactAreaContainer = styled("div", {
  base: {
    alignItems: "center",
    backgroundColor: "surface.brand.4",
    borderRadius: "medium",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    paddingBlock: "xxlarge",
  },
});

const AvatarContainer = styled("div", {
  base: {
    maxHeight: "surface.xsmall",
    maxWidth: "surface.xsmall",
  },
});

const MobileButtonContainer = styled("div", {
  base: {
    paddingBlockStart: "4xsmall",
    display: "block",
    tablet: {
      display: "none",
    },
  },
});

const MyContactArea = ({ user, showProfileButton }: MyContractAreaProps) => {
  return (
    <MyContactAreaContainer>
      {!isStudent(user as withRole) && (
        <AvatarContainer>
          <UserAvatar userName={user.displayName} />
        </AvatarContainer>
      )}
      <Heading id="userName" textStyle="heading.medium" asChild consumeCss>
        <h2>{user.displayName}</h2>
      </Heading>
      <Text textStyle="title.medium">{user.primaryOrg}</Text>
      {/* TODO: Vurdere om vi også skal hente fylkesorganisasjonen og legge den her, ref design */}
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
