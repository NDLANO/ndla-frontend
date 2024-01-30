/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, spacing, misc } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';
import Avatar from './Avatar';
import { isArenaModerator } from '../../../components/AuthenticationContext';
import { GQLArenaUserV2 } from '../../../graphqlTypes';
import { useArenaUser } from '../Arena/components/temporaryNodebbHooks';

type UserProfileTagProps = {
  user: GQLArenaUserV2;
};

const Name = styled(Text)`
  text-decoration: underline;
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
    [data-name='hover'] {
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

const ModeratorTag = styled(Text)`
  border-radius: ${misc.borderRadius};
  padding: 2px ${spacing.small};
  background-color: ${colors.brand.primary};
  width: fit-content;
  height: fit-content;
  color: ${colors.white};
`;

const UserProfileTag = ({ user }: UserProfileTagProps) => {
  const { username, displayName, location } = user;
  const { arenaUser } = useArenaUser(username); // TODO: Delete this hook and use user directly when nodebb dies

  const { t } = useTranslation();

  return (
    <UserProfileTagContainer to={`/minndla/arena/user/${username}`}>
      <Avatar displayName={displayName} profilePicture={undefined} />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name textStyle="meta-text-large" margin="none" data-name="hover">
            {displayName}
          </Name>
          {isArenaModerator(arenaUser.groups) && (
            <ModeratorTag textStyle="meta-text-xsmall" margin="none">
              {t('user.moderator')}
            </ModeratorTag>
          )}
        </NameAndTagContainer>
        <Text textStyle="meta-text-small" margin="none">
          {location}
        </Text>
      </UserInformationContainer>
    </UserProfileTagContainer>
  );
};

export default UserProfileTag;
