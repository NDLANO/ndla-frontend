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
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons/common";
import {
  Text,
  Badge,
  Button,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Spinner,
  Table,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { usePaginationTranslations } from "@ndla/ui";
import { routes } from "../../../../routeHelpers";
import { formateDateObject } from "../../../../util/formatDate";
import { useArenaFlags } from "../../arenaQueries";

export const StyledTable = styled(Table, {
  base: {
    padding: "xsmall",
    display: "table",
  },
});

export const StyledHeaderRow = styled("tr", {
  base: {
    textAlign: "left",
    borderBottom: "3px solid",
    borderColor: "surface.brand.1.strong",

    "& th": {
      border: "none",
      borderWidth: "0 !important",
      borderColor: "surface.default",
      mobileWideDown: {
        paddingInline: "0",
      },
    },

    mobileWideToDesktop: {
      display: "grid",
      gridTemplateColumns: "2",
    },

    mobileWideDown: {
      display: "grid",
      gridTemplateColumns: "1",
    },
  },
});

export const StyledRow = styled("tr", {
  base: {
    position: "relative",
    border: "none",
    borderBlockEnd: "1px solid",
    borderColor: "surface.brand.1.subtle",

    "& td": {
      border: "none",
      borderWidth: "0",
      wordBreak: "break-all",
    },

    "& [data-title='']": {
      textDecoration: "underline",
    },
    _hover: {
      backgroundColor: "surface.infoSubtle",
      "& [data-title='']": {
        textDecoration: "none",
      },
    },

    mobileWideToDesktop: {
      display: "grid",
      gridTemplateColumns: "2",
    },

    mobileWideDown: {
      display: "grid",
      gridTemplateColumns: "1",
    },
  },
});

export const StyledSafeLink = styled(SafeLink, {
  base: {
    // Make link clickable on whole row
    position: "absolute",
    zIndex: 1,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export const StatusBox = styled(Badge, {
  base: {
    display: "inline-block",
    color: "surface.default",
  },
});

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

  const arenaFlags = arenaAllFlags?.items.map((post) => {
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

    return (
      <StyledRow key={`btn-${post.id}`} consumeCss>
        <td data-title="">Post {post.id}</td>
        <td>{count}</td>
        <td>{lastFlagAt}</td>
        <td>
          <StyledSafeLink to={`${post.id}`}></StyledSafeLink>
          {resolvedFlags.length === flags.length ? (
            <StatusBox css={{ backgroundColor: "surface.success.hover" }}>
              {t(`myNdla.arena.admin.flags.status.resolved`)}
            </StatusBox>
          ) : (
            <StatusBox css={{ backgroundColor: "surface.danger" }}>
              {t(`myNdla.arena.admin.flags.status.unresolved`)}
            </StatusBox>
          )}
        </td>
      </StyledRow>
    );
  });

  return (
    <>
      <StyledTable>
        <thead>
          <StyledHeaderRow>
            <th>{t("myNdla.arena.admin.flags.postId")}</th>
            <th>{t("myNdla.arena.admin.flags.numFlags")}</th>
            <th>{t("myNdla.arena.admin.flags.latestFlag")}</th>
            <th>{t("myNdla.arena.admin.flags.status.title")}</th>
          </StyledHeaderRow>
        </thead>
        <tbody>{arenaFlags}</tbody>
      </StyledTable>
      <PaginationRoot
        page={page}
        onPageChange={(details) => onQueryPush({ ...searchObject, page: details.page })}
        translations={componentTranslations}
        count={arenaAllFlags?.totalCount ?? 0}
        siblingCount={2}
        pageSize={pageSize}
      >
        <PaginationPrevTrigger asChild>
          <Button variant="tertiary">
            <ArrowLeftShortLine />
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
            <ArrowRightShortLine />
          </Button>
        </PaginationNextTrigger>
      </PaginationRoot>
    </>
  );
};

export default FlaggedPosts;
