/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing, breakpoints, mq } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import UserAvatar from './UserAvatar';
import EditProfilePicture from '../MyProfile/components/EditProfilePicture';
import { GQLMyNdlaPersonalDataFragmentFragment } from '../../../graphqlTypes';
import { isStudent } from '../Folders/util';

type MyContractAreaProps = {
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
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

const UserCountyText = styled(Text)`
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
      {!isStudent(user) && (
        <AvatarContainer>
          <UserAvatar userName={user?.displayName} />
        </AvatarContainer>
      )}
      <Heading element="h2" id="userName" margin="none" headingStyle="h2">
        {user?.displayName}
      </Heading>
      <UserInfoContainer>
        <UserWorkPlaceText element="h2" headingStyle="list-title" margin="none">
          {user?.groups.find((g) => g.isPrimarySchool)?.displayName}
        </UserWorkPlaceText>
        <UserCountyText element="p" textStyle="meta-text-small" margin="none">
          {user?.organization}
        </UserCountyText>
      </UserInfoContainer>
      {showProfileButton && (
        <>
          {!isStudent(user) && (
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
