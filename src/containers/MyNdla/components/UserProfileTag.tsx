/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
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

const ModeratorTag = styled.span`
  border-radius: ${spacing.xxsmall};
  padding: 2px ${spacing.small};
  background-color: ${colors.brand.primary};
  width: fit-content;
  height: fit-content;
  ${fonts.sizes('12px', '20px')}
  color: ${colors.white};
  font-weight: ${fonts.weight.semibold};
`;

const UserRegion = styled.div`
  color: ${colors.text.primary};
  ${fonts.size.text.metaTextSmall}
`;

const UserProfileTag = ({
  displayName,
  username,
  affiliation,
}: UserProfileTagProps) => {
  const { t } = useTranslation();
  const { data } = useArenaUser(username ?? '');

  const checkIfModerator = (): boolean | undefined => {
    return data?.arenaUser?.groupTitleArray?.includes('Moderator');
  };

  return (
    // missing link to profile
    <UserProfileTagContainer to="https://om.ndla.no/gdpr">
      <Avatar
        displayName={data?.arenaUser?.displayName}
        profilePicture={data?.arenaUser?.profilePicture}
      />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name>{displayName}</Name>
          {checkIfModerator() && (
            <ModeratorTag>{t('user.moderator')}</ModeratorTag>
          )}
        </NameAndTagContainer>
        <UserRegion>{affiliation}</UserRegion>
      </UserInformationContainer>
    </UserProfileTagContainer>
  );
};

export default UserProfileTag;
