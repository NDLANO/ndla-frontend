/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compareDesc } from 'date-fns';
import { parse, stringify } from 'query-string';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors, spacing, misc } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import Pager from '@ndla/pager';
import SafeLink from '@ndla/safelink';
import { formateDateObject } from '../../../../util/formatDate';
import { useArenaFlags } from '../../arenaQueries';

const RowStyle = css`
  color: ${colors.text.primary};
  display: grid;
  border: 1px solid ${colors.brand.light};
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: ${spacing.xxsmall} 0px;
  border-radius: ${misc.borderRadius};
  box-shadow: none;
  line-height: unset;

  padding: 10px;
`;

const StyledRow = styled.li`
  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    text-decoration: underline;
  }

  ${RowStyle}
`;

const StyledHeaderRow = styled.div`
  background-color: ${colors.brand.lighter};

  ${RowStyle}
`;

const StateBoxStyle = css`
  color: ${colors.white};
  padding: ${spacing.xxsmall};
  border-radius: ${misc.borderRadius};
`;

const ResolvedBox = styled.span`
  background-color: ${colors.support.green};

  ${StateBoxStyle}
`;

const UnresolvedBox = styled.span`
  background-color: ${colors.support.red};

  ${StateBoxStyle}
`;

const Cell = styled.div``;

type SearchObject = {
  page: string;
};

export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const FlaggedPosts = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchObject = parse(location.search);
  const page = getPage(searchObject);
  const pageSize = 30;
  const { arenaAllFlags, loading } = useArenaFlags({
    variables: {
      page,
      pageSize,
    },
  });
  const lastPage = Math.ceil((arenaAllFlags?.totalCount ?? 0) / pageSize);

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    Object.keys(searchQuery).forEach(
      (key) => searchQuery[key] === '' && delete searchQuery[key],
    );
    navigate(`/minndla/admin/flags?${stringify(searchQuery)}`);
  };

  if (loading) return <Spinner />;
  if ((arenaAllFlags?.items?.length ?? 0) === 0)
    return <p>{t('myNdla.arena.admin.flags.noflags')}</p>;

  return (
    <>
      <div>
        <StyledHeaderRow>
          <Cell>{t('myNdla.arena.admin.flags.postId')}</Cell>
          <Cell>{t('myNdla.arena.admin.flags.numFlags')}</Cell>
          <Cell>{t('myNdla.arena.admin.flags.latestFlag')}</Cell>
          <Cell>{t('myNdla.arena.admin.flags.status.title')}</Cell>
        </StyledHeaderRow>
        {arenaAllFlags?.items.map((post) => {
          const flags = (post.flags ?? []).map((f) => {
            return {
              ...f,
              createdObject: new Date(f.created),
            };
          });
          const sortedFlags = flags.sort((flagA, flagB) =>
            compareDesc(flagA.createdObject, flagB.createdObject),
          );

          const lastFlagAt = sortedFlags[0]?.createdObject
            ? formateDateObject(sortedFlags[0]?.createdObject, i18n.language)
            : '';

          const resolvedFlags = sortedFlags.filter((flag) => flag.isResolved);
          const count = `${resolvedFlags.length}/${flags.length}`;

          const state =
            resolvedFlags.length === flags.length ? (
              <ResolvedBox>
                {t(`myNdla.arena.admin.flags.status.resolved`)}
              </ResolvedBox>
            ) : (
              <UnresolvedBox>
                {t(`myNdla.arena.admin.flags.status.unresolved`)}
              </UnresolvedBox>
            );

          return (
            <SafeLink to={`${post.id}`} key={`btn-${post.id}`}>
              <StyledRow key={`post-${post.id}`}>
                <Cell>Post {post.id}</Cell>
                <Cell>{count}</Cell>
                {<Cell>{lastFlagAt}</Cell>}
                {<Cell>{state}</Cell>}
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

export default FlaggedPosts;
