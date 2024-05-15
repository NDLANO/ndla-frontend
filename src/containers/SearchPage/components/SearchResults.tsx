/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Cross } from "@ndla/icons/action";
import { Heading, Text } from "@ndla/typography";
import { ContentTypeBadge } from "@ndla/ui";
import SearchResultItem from "./SearchResultItem";
import { SearchGroup, TypeFilter } from "../searchHelpers";
import { ViewType } from "../searchTypes";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${spacing.normal};
  margin: ${spacing.medium} 0;
  position: relative;
`;

const HeaderWrapper = styled.hgroup`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 2px;
  background: ${colors.brand.tertiary};
  margin: 0 0 ${spacing.small};
`;

const Progress = styled.span`
  display: block;
  background: ${colors.brand.primary};
  height: 2px;
  width: min(var(--width), 100%);
`;

const SearchResultsList = styled.ul`
  display: grid;
  align-items: flex-start;
  list-style: none;
  padding: 0;
  row-gap: ${spacing.normal};
  grid-template-columns: repeat(1, 1fr);
  &[data-viewtype="grid"] {
    ${mq.range({ from: breakpoints.tablet })} {
      column-gap: ${spacing.normal};
      grid-template-columns: repeat(2, 1fr);
    }

    ${mq.range({ from: breakpoints.desktop })} {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

interface Props {
  group: SearchGroup;
  typeFilter: Record<string, TypeFilter>;
  handleSubFilterClick: (type: string, filterId: string) => void;
  handleShowMore: (type: string) => void;
  loading: boolean;
  viewType: ViewType;
}

export const SearchResultGroup = ({
  group,
  typeFilter,
  handleShowMore,
  handleSubFilterClick,
  loading,
  viewType,
}: Props) => {
  const { t } = useTranslation();
  const headingId = useId();
  const filter = typeFilter[group.type];
  const filters =
    filter?.filters.filter((filter) => group.resourceTypes.includes(filter.id) || filter.id === "all") ?? [];
  const toCount = filter ? filter?.page * filter.pageSize : 0;

  const onToTopHandler = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Wrapper key={`searchresult-${group.type}`}>
      <HeaderWrapper>
        <ContentTypeBadge
          type={group.type === "topic-article" ? "topic" : group.type}
          background
          size="large"
          border={false}
        />
        <Heading element="h2" headingStyle="h4" margin="none" id={headingId}>
          {group.type ? t(`contentTypes.${group.type}`) : t("searchPage.resultType.allContentTypes")}
        </Heading>
        {!!group.totalCount && (
          <Text textStyle="meta-text-small" margin="none">
            {t("searchPage.resultType.hits", { count: group.totalCount })}
          </Text>
        )}
      </HeaderWrapper>
      {/* TODO: Maybe make this a ToggleGroup?  */}
      <ButtonsWrapper>
        {filters.map((filter) => (
          <ButtonV2
            size="xsmall"
            shape="pill"
            key={filter.id}
            colorTheme={filter.active ? undefined : "greyLighter"}
            onClick={() => handleSubFilterClick(group.type, filter.id)}
          >
            {filter.name}
            {filter.active && <Cross />}
          </ButtonV2>
        ))}
      </ButtonsWrapper>
      <SearchResultsList data-viewtype={viewType}>
        {group.items.slice(0, toCount).map((item) => (
          <SearchResultItem item={item} key={item.id} type={group.type} />
        ))}
      </SearchResultsList>
      <PaginationWrapper>
        <Text textStyle="meta-text-medium">
          {toCount < group.totalCount
            ? t("searchPage.resultType.showing", {
                count: toCount,
                totalCount: group.totalCount,
                contentType: "",
              })
            : t("searchPage.resultType.showingAll")}
        </Text>
        <ProgressBar>
          <Progress style={{ "--width": `${Math.ceil((toCount / group.totalCount) * 100)}%` } as CSSProperties} />
        </ProgressBar>
        {loading && <Spinner />}
        {toCount < group.totalCount ? (
          <ButtonV2 variant="outline" aria-describedby={headingId} onClick={() => handleShowMore(group.type)}>
            {t("searchPage.resultType.showMore")}
          </ButtonV2>
        ) : (
          <ButtonV2 variant="outline" onClick={onToTopHandler}>
            {t("searchPage.resultType.toTopOfPage")}
          </ButtonV2>
        )}
      </PaginationWrapper>
    </Wrapper>
  );
};
