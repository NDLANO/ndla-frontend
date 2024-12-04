/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse, stringify } from "query-string";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PaginationContext } from "@ark-ui/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  Button,
  Input,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { usePaginationTranslations } from "@ndla/ui";
import { StyledTable, StyledHeaderRow } from "./FlaggedPosts";
import UserList from "./UserList";
import { routes } from "../../../../routeHelpers";
import { useArenaUsers } from "../../arenaQueries";

type SearchObject = {
  page: string;
};

const SearchInput = styled(Input, { base: { width: "35%" } });

export const Cell = styled("div", { base: { whiteSpace: "nowrap" } });

const StyledPaginationRoot = styled(PaginationRoot, {
  base: {
    flexWrap: "wrap",
  },
});

const StyledButton = styled(Button, {
  base: {
    tabletWideDown: {
      paddingInline: "xsmall",
      "& span": {
        display: "none",
      },
    },
  },
});

const StyledPaginationItem = styled(PaginationItem, {
  base: {
    tabletWideDown: {
      "&:nth-child(2)": {
        display: "none",
      },
      "&:nth-last-child(2)": {
        display: "none",
      },
    },
  },
});

export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const Users = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchObject = parse(location.search);
  const [queryString, setQueryString] = useState("");
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
    navigate(routes.myNdla.adminUsers + `?${stringify(newSearchQuery)}`);
  };

  return (
    <>
      <>
        <SearchInput
          placeholder={t("myNdla.arena.admin.users.search")}
          onChange={(e) => {
            setQueryString(e.target.value);
            navigate(routes.myNdla.adminUsers + "?page=1"); // Reset page number when searching
          }}
        />
        <StyledTable>
          <thead>
            <StyledHeaderRow>
              <th>{t("myNdla.arena.admin.users.username")}</th>
              <th>{t("myNdla.arena.admin.users.displayName")}</th>
              <th>{t("myNdla.arena.admin.users.location")}</th>
              <th>{t("myNdla.arena.admin.users.isAdmin")}</th>
            </StyledHeaderRow>
          </thead>
          <UserList loading={loading} users={users} />
        </StyledTable>
      </>
      <StyledPaginationRoot
        page={page}
        onPageChange={(details) => onQueryPush({ ...searchObject, page: details.page })}
        count={users?.totalCount ?? 0}
        pageSize={pageSize}
        translations={componentTranslations}
      >
        <PaginationPrevTrigger asChild>
          <StyledButton variant="tertiary" aria-label={t("pagination.prev")} title={t("pagination.prev")}>
            <ArrowLeftShortLine />
            <span>{t("pagination.prev")}</span>
          </StyledButton>
        </PaginationPrevTrigger>
        <PaginationContext>
          {(pagination) =>
            pagination.pages.map((page, index) =>
              page.type === "page" ? (
                <StyledPaginationItem key={index} {...page} asChild>
                  <Button variant={page.value === pagination.page ? "primary" : "tertiary"}>{page.value}</Button>
                </StyledPaginationItem>
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
          <StyledButton variant="tertiary" aria-label={t("pagination.next")} title={t("pagination.next")}>
            <span>{t("pagination.next")}</span>
            <ArrowRightShortLine />
          </StyledButton>
        </PaginationNextTrigger>
      </StyledPaginationRoot>
    </>
  );
};

export default Users;
