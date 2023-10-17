/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, colors, spacing, breakpoints, mq } from '@ndla/core';
import { Heading } from '@ndla/typography';
import { parseUserObject } from './parseUserObject';
import UserAvatar from './UserAvatar';
import EditProfilePicture from '../MyProfile/components/EditProfilePicture';
import { FeideUserApiType } from '../../../interfaces';

type MyContractAreaProps = {
  user: FeideUserApiType | undefined;
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

const StyledUserNameHeading = styled(Heading)`
  ${fonts.sizes('30px', '38px')}
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const UserWorkPlaceText = styled.div`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  text-transform: uppercase;
  color: ${colors.brand.primary};
`;

const UserCountyText = styled.div`
  ${fonts.sizes('16px', '26px')};
  color: ${colors.brand.primary};
`;

const MobileButtonContainer = styled.div`
  padding-top: ${spacing.xxsmall};
  ${mq.range({ from: breakpoints.tablet })} {
    display: none;
  }
`;

const MyContactArea = ({ user, showProfileButton }: MyContractAreaProps) => {
  const parsedUser = user && parseUserObject(user);

  return (
    <MyContactAreaContainer>
      <AvatarContainer>
        <UserAvatar
          hasUploadedAvatar={false}
          userName={user?.displayName}
          showProfileButton
        />
      </AvatarContainer>
      <StyledUserNameHeading
        element="h2"
        id="userName"
        margin="none"
        headingStyle="default"
      >
        {user?.displayName}
      </StyledUserNameHeading>
      <UserInfoContainer>
        <UserWorkPlaceText>
          {user?.primarySchool?.displayName}
        </UserWorkPlaceText>
        <UserCountyText>
          {parsedUser &&
            parsedUser.organizations.length > 0 &&
            parsedUser.organizations.at(0)?.displayName}
        </UserCountyText>
      </UserInfoContainer>
      {showProfileButton && (
        <MobileButtonContainer>
          <EditProfilePicture />
        </MobileButtonContainer>
      )}
    </MyContactAreaContainer>
  );
};
export default MyContactArea;
