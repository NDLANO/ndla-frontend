/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse, stringify } from 'query-string';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors, spacing, misc } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import Pager from '@ndla/pager';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';
import { isArenaModerator } from '../../../../components/AuthenticationContext';
import { GQLArenaUserV2Fragment } from '../../../../graphqlTypes';
import { useArenaUsers } from '../../arenaQueries';

const rowStyle = css`
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

const StyledRow = styled.li`
  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    text-decoration: underline;
  }

  ${rowStyle}
`;

const StyledHeaderRow = styled.div`
  background-color: ${colors.brand.lighter};

  ${rowStyle}
`;

const Cell = styled.div`
  white-space: nowrap;
`;

type SearchObject = {
  page: string;
};

const ModeratorTag = styled(Text)`
  border-radius: ${misc.borderRadius};
  padding: 2px ${spacing.small};
  background-color: ${colors.brand.primary};
  width: fit-content;
  height: fit-content;
  color: ${colors.white};
`;

export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const ModTag = ({ user }: { user: GQLArenaUserV2Fragment }) => {
  const { t } = useTranslation();
  if (!isArenaModerator(user.groups)) {
    return null;
  }

  return (
    <ModeratorTag textStyle="meta-text-xsmall" margin="none">
      {t('user.moderator')}
    </ModeratorTag>
  );
};

const Users = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchObject = parse(location.search);
  const page = getPage(searchObject);
  const pageSize = 30;
  const { users, loading } = useArenaUsers({
    variables: {
      page,
      pageSize,
    },
  });

  const lastPage = Math.ceil((users?.totalCount ?? 0) / pageSize);

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    const newSearchQuery = Object.keys(searchQuery).reduce((acc, key) => {
      if (searchQuery[key] === '') return acc;
      return { ...acc, [key]: searchQuery[key] === '' };
    }, {});
    navigate(`/minndla/admin/users?${stringify(newSearchQuery)}`);
  };

  if (loading) return <Spinner />;
  if ((users?.items?.length ?? 0) === 0)
    return <div>{t('myNdla.arena.admin.users.noUsers')}</div>;

  return (
    <>
      <div>
        <StyledHeaderRow>
          <Cell>{t('myNdla.arena.admin.users.username')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.displayName')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.location')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.isAdmin')}</Cell>
        </StyledHeaderRow>
        {users?.items.map((user) => {
          return (
            <SafeLink
              to={`/minndla/arena/user/${user.username}`}
              key={`btn-${user.id}`}
            >
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
      </div>
      <Pager
        page={page}
        lastPage={lastPage}
        pageItemComponentClass="button"
        query={searchObject}
        onClick={onQueryPush}
      />
    </>
  );
};

export default Users;
