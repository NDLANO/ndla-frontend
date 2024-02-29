/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import SafeLink from "@ndla/safelink";
import { Text } from "@ndla/typography";
import Avatar from "./Avatar";
import { isArenaModerator } from "../../../components/AuthenticationContext";
import { GQLArenaUserV2 } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { useArenaUser } from "../Arena/components/temporaryNodebbHooks";

type UserProfileTagProps = {
  user: GQLArenaUserV2 | undefined;
};

const Name = styled(Text)`
  text-decoration: underline;
`;

const userProfileTagContainerStyle = css`
  display: flex;
  gap: ${spacing.normal};
  color: ${colors.text.primary};
  height: fit-content;
  width: fit-content;
  text-decoration: none;
  box-shadow: none;
  padding: ${spacing.xsmall};
`;

const UserProfileTagContainer = styled(SafeLink)`
  &:hover {
    [data-name="hover"] {
      text-decoration: none;
    }
  }

  ${userProfileTagContainerStyle}
`;

const UserProfileTagContainerNoLink = styled.div`
  ${userProfileTagContainerStyle}
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

const TagContainer = ({ username, children }: { children: ReactNode; username: string | undefined }) => {
  const link = username ? routes.myNdla.arenaUser(username) : null;
  if (!link) {
    return <UserProfileTagContainerNoLink>{children}</UserProfileTagContainerNoLink>;
  }

  return <UserProfileTagContainer to={link}>{children}</UserProfileTagContainer>;
};

const UserProfileTag = ({ user }: UserProfileTagProps) => {
  const { arenaUser } = useArenaUser(user?.username); // TODO: Delete this hook and use user directly when nodebb dies
  const { t } = useTranslation();

  const displayName = user?.displayName ? user.displayName : t("user.deletedUser");

  return (
    <TagContainer username={user?.username}>
      <Avatar displayName={displayName} profilePicture={undefined} />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name textStyle="meta-text-large" margin="none" data-name="hover">
            {displayName}
          </Name>
          {isArenaModerator(arenaUser.groups) && (
            <ModeratorTag textStyle="meta-text-xsmall" margin="none">
              {t("user.moderator")}
            </ModeratorTag>
          )}
        </NameAndTagContainer>
        {user?.location && (
          <Text textStyle="meta-text-small" margin="none">
            {user?.location}
          </Text>
        )}
      </UserInformationContainer>
    </TagContainer>
  );
};

export default UserProfileTag;
