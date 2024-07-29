/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { rowStyle, StatusBox, StyledRow } from "./FlaggedPosts";
import { Cell } from "./Users";
import { isArenaModerator } from "../../../../components/AuthenticationContext";
import { GQLArenaUserV2Fragment, GQLPaginatedArenaUsers } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";

interface Props {
  loading: boolean;
  users: GQLPaginatedArenaUsers | undefined;
}

const ModTag = ({ user }: { user: GQLArenaUserV2Fragment }) => {
  const { t } = useTranslation();
  if (!isArenaModerator(user.groups)) {
    return null;
  }

  return <StatusBox css={{ backgroundColor: "surface.brand.2.strong" }}>{t("user.moderator")}</StatusBox>;
};

const UserList = ({ loading, users }: Props) => {
  const { t } = useTranslation();
  if (loading) return <Spinner />;
  if ((users?.items?.length ?? 0) === 0) return <div>{t("myNdla.arena.admin.users.noUsers")}</div>;

  return (
    <>
      {users?.items.map((user) => {
        return (
          <SafeLink to={routes.myNdla.arenaUser(user.username)} key={`btn-${user.id}`}>
            <StyledRow css={rowStyle}>
              <Cell>{user.username}</Cell>
              <Cell>{user.displayName}</Cell>
              <Cell>{user.location}</Cell>
              <Cell>
                <ModTag user={user} />
              </Cell>
            </StyledRow>
          </SafeLink>
        );
      })}
    </>
  );
};

export default UserList;
