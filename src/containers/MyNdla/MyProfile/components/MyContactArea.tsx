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
import { FeideUserApiType } from '@ndla/ui';
import { parseUserObject } from '../../components/parseUserObject';
import UserAvatar from './UserAvatar';
import EditProfilePicture from './EditProfilePicture';

type MyContractAreaProps = {
  user: FeideUserApiType | undefined;
};

const StyledMyContactAreaContainer = styled.div`
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

const StyledAvatarContainer = styled.div`
  max-width: 250px;
  max-height: 250px;
`;

const StyledUserNameHeading = styled(Heading)`
  ${fonts.sizes('30px', '38px')}
`;

const StyledUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const StyledUserWorkPlaceText = styled.div`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  text-transform: uppercase;
  color: ${colors.brand.primary};
`;

const StyledUserCountyText = styled.div`
  ${fonts.sizes('16px', '26px')};
  color: ${colors.brand.primary};
`;

const StyledMobileButtonContainer = styled.div`
  padding-top: ${spacing.xxsmall};
  ${mq.range({ from: breakpoints.tablet })} {
    display: none;
  }
`;

const MyContactArea = ({ user }: MyContractAreaProps) => {
  const parsedUser = user && parseUserObject(user);

  return (
    <StyledMyContactAreaContainer>
      <StyledAvatarContainer>
        <UserAvatar hasUploadedAvatar userName={user?.displayName} />
      </StyledAvatarContainer>
      <StyledUserNameHeading
        element="h2"
        id="userName"
        margin="none"
        headingStyle="default"
      >
        {user?.displayName}
      </StyledUserNameHeading>
      <StyledUserInfoContainer>
        <StyledUserWorkPlaceText>
          {user?.primarySchool?.displayName}
        </StyledUserWorkPlaceText>
        <StyledUserCountyText>
          {parsedUser &&
            parsedUser.organizations.length > 0 &&
            parsedUser.organizations.at(0)?.displayName}
        </StyledUserCountyText>
      </StyledUserInfoContainer>
      {/* Check for path to display the button. Only show in My Profile to make component generic */}
      <StyledMobileButtonContainer>
        <EditProfilePicture />
      </StyledMobileButtonContainer>
    </StyledMyContactAreaContainer>
  );
};
export default MyContactArea;
