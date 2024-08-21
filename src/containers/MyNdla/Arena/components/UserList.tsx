/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { StatusBox, StyledRow, StyledSafeLink } from "./FlaggedPosts";
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
    <tbody>
      {users?.items.map((user) => {
        return (
          <StyledRow key={`btn-${user.id}`} consumeCss>
            <td data-title="">
              <div>{user.username}</div>
            </td>
            <td>{user.displayName}</td>
            <td>{user.location}</td>
            <td>
              <ModTag user={user} />
              <StyledSafeLink to={routes.myNdla.arenaUser(user.username)}></StyledSafeLink>
            </td>
          </StyledRow>
        );
      })}
    </tbody>
  );
};

export default UserList;
