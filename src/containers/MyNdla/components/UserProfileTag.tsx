/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import ModeratorTag from './ModeratorTag';
import Avatar from './Avatar';
import { useArenaUser } from '../arenaQueries';

type UserProfileTagProps = {
  displayName: string | undefined;
  username: string | undefined;
  affiliation: string | undefined;
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

// missing link to profile
const UserProfileTag = ({
  displayName,
  username,
  affiliation,
}: UserProfileTagProps) => {
  const { arenaUser } = useArenaUser(username ?? '');

  return (
    <UserProfileTagContainer to="https://om.ndla.no/gdpr">
      <Avatar
        displayName={arenaUser?.arenaUser?.displayName}
        profilePicture={arenaUser?.arenaUser?.profilePicture}
      />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name>{displayName}</Name>
          {arenaUser?.arenaUser?.groupTitle === '["Moderator"]' && (
            <ModeratorTag />
          )}
        </NameAndTagContainer>
        <UserRegion>{affiliation}</UserRegion>
      </UserInformationContainer>
    </UserProfileTagContainer>
  );
};

export default UserProfileTag;
