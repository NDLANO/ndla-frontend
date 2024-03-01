/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import SafeLink from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { Cell } from "./Users";
import { isArenaModerator } from "../../../../components/AuthenticationContext";
import { GQLArenaUserV2Fragment, GQLPaginatedArenaUsers } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";

interface Props {
  loading: boolean;
  users: GQLPaginatedArenaUsers | undefined;
}

const StyledRow = styled.li`
  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    text-decoration: underline;
  }

  color: ${colors.text.primary};
  display: grid;
  border: 1px solid ${colors.brand.light};
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  margin: ${spacing.xxsmall} 0px;
  border-radius: ${misc.borderRadius};
  box-shadow: none;
  line-height: unset;
  padding: ${spacing.small};
`;

const ModeratorTag = styled(Text)`
  border-radius: ${misc.borderRadius};
  padding: 2px ${spacing.small};
  background-color: ${colors.brand.primary};
  width: fit-content;
  height: fit-content;
  color: ${colors.white};
`;

const ModTag = ({ user }: { user: GQLArenaUserV2Fragment }) => {
  const { t } = useTranslation();
  if (!isArenaModerator(user.groups)) {
    return null;
  }

  return (
    <ModeratorTag textStyle="meta-text-xsmall" margin="none">
      {t("user.moderator")}
    </ModeratorTag>
  );
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
            <StyledRow>
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
