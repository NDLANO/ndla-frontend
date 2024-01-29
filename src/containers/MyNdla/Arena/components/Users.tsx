/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse, stringify } from 'query-string';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors, spacing, misc } from '@ndla/core';
import { InputV3 } from '@ndla/forms';
import Pager from '@ndla/pager';
import UserList from './UserList';
import { useArenaUsers } from '../../arenaQueries';

const StyledHeaderRow = styled.div`
  background-color: ${colors.brand.lighter};
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

export const Cell = styled.div`
  white-space: nowrap;
`;

type SearchObject = {
  page: string;
};

const SearchInput = styled(InputV3)`
  width: 35%;
`;

export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const Users = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchObject = parse(location.search);
  const [queryString, setQueryString] = useState('');
  const page = getPage(searchObject);
  const pageSize = 30;
  const { users, loading } = useArenaUsers({
    variables: {
      page,
      pageSize,
      filterTeachers: true,
      query: queryString ? queryString : undefined,
    },
  });

  const lastPage = Math.ceil((users?.totalCount ?? 0) / pageSize);

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    const newSearchQuery = Object.keys(searchQuery).reduce(
      (acc: Record<string, string>, key) => {
        if (searchQuery[key] === '') return acc;
        acc[key] = searchQuery[key];
        return acc;
      },
      {},
    );
    navigate(`/minndla/admin/users?${stringify(newSearchQuery)}`);
  };

  return (
    <>
      <div>
        <SearchInput
          placeholder={t('myNdla.arena.admin.users.search')}
          onChange={(e) => {
            setQueryString(e.target.value);
            navigate(`/minndla/admin/users?page=1`); // Reset page number when searching
          }}
        />
        <StyledHeaderRow>
          <Cell>{t('myNdla.arena.admin.users.username')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.displayName')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.location')}</Cell>
          <Cell>{t('myNdla.arena.admin.users.isAdmin')}</Cell>
        </StyledHeaderRow>
        <UserList loading={loading} users={users} />
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
