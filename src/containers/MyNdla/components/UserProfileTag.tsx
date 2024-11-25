/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import Avatar from "./Avatar";
import { isArenaModerator } from "../../../components/AuthenticationContext";
import config from "../../../config";
import { GQLArenaUserV2 } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { useArenaUser } from "../Arena/components/temporaryNodebbHooks";

type UserProfileTagProps = {
  user: GQLArenaUserV2 | undefined;
};

const Name = styled(Text, {
  base: {
    textDecoration: "underline",
  },
});

const UserProfileTagContainer = styled(SafeLink, {
  base: {
    color: "text.strong",
    display: "flex",
    gap: "medium",
    _hover: {
      "& [data-name='hover']": {
        textDecoration: "none",
      },
    },
  },
});

const UserProfileTagContainerNoLink = styled("div", {
  base: {
    color: "text.strong",
    display: "flex",
    gap: "medium",
  },
});

const UserInformationContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const NameAndTagContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: "xsmall",
  },
});

const ModeratorTag = styled(Text, {
  base: {
    backgroundColor: "surface.action",
    borderRadius: "xsmall",
    height: "fit-content",
    paddingBlock: "3xsmall",
    paddingInline: "xxsmall",
  },
});

const getUserLink = (user: GQLArenaUserV2 | undefined) => {
  if (!user) return null;

  if (config.enableNodeBB) {
    return routes.myNdla.arenaUser(user.id.toString());
  }

  return routes.myNdla.arenaUser(user?.username);
};

const TagContainer = ({ user, children }: { children: ReactNode; user: GQLArenaUserV2 | undefined }) => {
  const link = getUserLink(user);
  if (!link) {
    return <UserProfileTagContainerNoLink>{children}</UserProfileTagContainerNoLink>;
  }

  return <UserProfileTagContainer to={link}>{children}</UserProfileTagContainer>;
};

const UserProfileTag = ({ user }: UserProfileTagProps) => {
  const { arenaUser } = useArenaUser(user?.id); // TODO: Delete this hook and use user directly when nodebb dies
  const { t } = useTranslation();

  const profilePicture = undefined;
  const displayName = user?.displayName ? user.displayName : t("user.deletedUser");

  return (
    <TagContainer user={user}>
      <Avatar aria-hidden={!profilePicture} displayName={displayName} profilePicture={profilePicture} />
      <UserInformationContainer>
        <NameAndTagContainer>
          <Name textStyle="title.small" data-name="hover">
            {displayName}
          </Name>
          {isArenaModerator(arenaUser.groups) && (
            <ModeratorTag textStyle="label.xsmall" color="text.onAction">
              {t("user.moderator")}
            </ModeratorTag>
          )}
        </NameAndTagContainer>
        {!!user?.location && <Text textStyle="body.small">{user?.location}</Text>}
      </UserInformationContainer>
    </TagContainer>
  );
};

export default UserProfileTag;
