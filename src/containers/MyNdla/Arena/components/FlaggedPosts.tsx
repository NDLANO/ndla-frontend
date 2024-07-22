/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compareDesc } from "date-fns";
import { parse, stringify } from "query-string";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PaginationContext } from "@ark-ui/react";
import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { ChevronLeft, ChevronRight } from "@ndla/icons/common";
import {
  Text,
  Button,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { usePaginationTranslations } from "@ndla/ui";
import { routes } from "../../../../routeHelpers";
import { formateDateObject } from "../../../../util/formatDate";
import { useArenaFlags } from "../../arenaQueries";

const rowStyle = css`
  color: ${colors.text.primary};
  display: grid;
  border: 1px solid ${colors.brand.light};
  grid-template-columns: repeat(4, 1fr);
  margin: ${spacing.xxsmall} 0px;
  border-radius: ${misc.borderRadius};
  box-shadow: none;
  line-height: unset;

  padding: 10px;
`;

const StyledRow = emotionStyled.li`
  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    text-decoration: underline;
  }

  ${rowStyle}
`;

const StyledHeaderRow = emotionStyled.div`
  background-color: ${colors.brand.lighter};

  ${rowStyle}
`;

const stateBoxStyle = css`
  color: ${colors.white};
  padding: ${spacing.xxsmall};
  border-radius: ${misc.borderRadius};
`;

const ResolvedBox = emotionStyled.span`
  background-color: ${colors.support.green};

  ${stateBoxStyle}
`;

const UnresolvedBox = emotionStyled.span`
  background-color: ${colors.support.red};

  ${stateBoxStyle}
`;

const StyledPaginationRoot = styled(PaginationRoot, { base: { display: "flex", justifyContent: "center" } });

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
    fetchPolicy: "no-cache",
    variables: {
      page,
      pageSize,
    },
  });
  const componentTranslations = usePaginationTranslations();

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    const newSearchQuery = Object.keys(searchQuery).reduce((acc: Record<string, string>, key) => {
      if (searchQuery[key] === "") return acc;
      acc[key] = searchQuery[key];
      return acc;
    }, {});
    navigate(routes.myNdla.adminFlags + `?${stringify(newSearchQuery)}`);
  };

  if (loading) return <Spinner />;
  if ((arenaAllFlags?.items?.length ?? 0) === 0) return <p>{t("myNdla.arena.admin.flags.noflags")}</p>;

  return (
    <>
      <div>
        <StyledHeaderRow>
          <div>{t("myNdla.arena.admin.flags.postId")}</div>
          <div>{t("myNdla.arena.admin.flags.numFlags")}</div>
          <div>{t("myNdla.arena.admin.flags.latestFlag")}</div>
          <div>{t("myNdla.arena.admin.flags.status.title")}</div>
        </StyledHeaderRow>
        {arenaAllFlags?.items.map((post) => {
          const flags = (post.flags ?? []).map((f) => {
            return {
              ...f,
              createdObject: new Date(f.created),
            };
          });
          const sortedFlags = flags.sort((flagA, flagB) => compareDesc(flagA.createdObject, flagB.createdObject));

          const lastFlagAt = sortedFlags[0]?.createdObject
            ? formateDateObject(sortedFlags[0]?.createdObject, i18n.language)
            : "";

          const resolvedFlags = sortedFlags.filter((flag) => flag.isResolved);
          const count = `${resolvedFlags.length}/${flags.length}`;

          const state =
            resolvedFlags.length === flags.length ? (
              <ResolvedBox>{t(`myNdla.arena.admin.flags.status.resolved`)}</ResolvedBox>
            ) : (
              <UnresolvedBox>{t(`myNdla.arena.admin.flags.status.unresolved`)}</UnresolvedBox>
            );

          return (
            <SafeLink to={`${post.id}`} key={`btn-${post.id}`}>
              <StyledRow key={`post-${post.id}`}>
                <div>Post {post.id}</div>
                <div>{count}</div>
                {<div>{lastFlagAt}</div>}
                {<div>{state}</div>}
              </StyledRow>
            </SafeLink>
          );
        })}
      </div>
      <StyledPaginationRoot
        page={page}
        onPageChange={(details) => onQueryPush({ ...searchObject, page: details.page })}
        translations={componentTranslations}
        count={arenaAllFlags?.totalCount ?? 0}
        siblingCount={2}
        pageSize={pageSize}
      >
        <PaginationPrevTrigger asChild>
          <Button variant="tertiary">
            <ChevronLeft />
            {t("pagination.prev")}
          </Button>
        </PaginationPrevTrigger>
        <PaginationContext>
          {(pagination) =>
            pagination.pages.map((page, index) =>
              page.type === "page" ? (
                <PaginationItem key={index} {...page} asChild>
                  <Button variant={page.value === pagination.page ? "primary" : "tertiary"}>{page.value}</Button>
                </PaginationItem>
              ) : (
                <PaginationEllipsis key={index} index={index} asChild>
                  <Text asChild consumeCss>
                    <div>&#8230;</div>
                  </Text>
                </PaginationEllipsis>
              ),
            )
          }
        </PaginationContext>
        <PaginationNextTrigger asChild>
          <Button variant="tertiary">
            {t("pagination.next")}
            <ChevronRight />
          </Button>
        </PaginationNextTrigger>
      </StyledPaginationRoot>
    </>
  );
};

export default FlaggedPosts;
