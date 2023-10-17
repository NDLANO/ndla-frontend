/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { FeideUserApiType } from '../../../interfaces';
import ModeratorTag from './ModeratorTag';

type UserProfileTagProps = {
  user: FeideUserApiType | undefined;
};

const Name = styled.div`
  text-decoration: underline;
  ${fonts.sizes('22px', '30px')}
  font-weight: ${fonts.weight.bold};
`;

const UserProfileTagContainer = styled(SafeLink)`
  display: flex;
  gap: ${spacing.normal};
  color: ${colors.text.primary};
  height: fit-content;
  width: fit-content;
  text-decoration: none;
  box-shadow: none;
  &:hover {
    ${Name} {
      text-decoration: none;
    }
  }
  padding: ${spacing.xsmall};
`;

const UserIcon = styled.div`
  width: 48px;
  height: 48px;
`;

const UserInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
`;

const NameAndTagContainer = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const UserRegion = styled.div`
  color: ${colors.text.primary};
  ${fonts.size.text.metaTextSmall}
`;

function UserProfileTag({ user }: UserProfileTagProps) {
  return (
    <UserProfileTagContainer to="https://om.ndla.no/gdpr">
      <UserIcon />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name>{user?.displayName}</Name>
          {user?.displayName && <ModeratorTag />}
        </NameAndTagContainer>
        <UserRegion>{user?.primarySchool?.displayName}</UserRegion>
      </UserInformationContainer>
    </UserProfileTagContainer>
  );
}

export default UserProfileTag;
