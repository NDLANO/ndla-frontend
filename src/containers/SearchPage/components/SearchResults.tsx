/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, ReactNode, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
import {
  Heading,
  Text,
  Button,
  Spinner,
  CheckboxGroup,
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxHiddenInput,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SearchResultItem from "./SearchResultItem";
import { SearchGroup, TypeFilter } from "../searchHelpers";

const Wrapper = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    marginBlock: "medium",
  },
});

const HeaderWrapper = styled("hgroup", { base: { display: "flex", alignItems: "center", gap: "medium" } });

const PaginationWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    alignItems: "center",
  },
});
const ProgressBar = styled("div", {
  base: {
    width: "surface.xxsmall",
    height: "1",
    background: "stroke.subtle",
  },
});

const Progress = styled("span", {
  base: { display: "block", background: "stroke.default", height: "2px", width: "min(var(--width),100%)" },
});

export const SearchResultsList = styled("ul", {
  base: {
    display: "grid",
    alignItems: "flex-start",
    listStyle: "none",
    padding: "0",
    rowGap: "medium",
    gridTemplateColumns: "repeat(1, 1fr)",
    tablet: { columnGap: "medium", gridTemplateColumns: "repeat(2,1fr)" },
    desktop: { gridTemplateColumns: "repeat(3,1fr)" },
  },
});

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});

interface Props {
  group: SearchGroup;
  typeFilter: Record<string, TypeFilter>;
  handleSubFilterClick: (type: string, filterIds: string[]) => void;
  handleShowMore: (type: string) => void;
  loading: boolean;
}

export const SearchResultGroup = ({ group, typeFilter, handleShowMore, handleSubFilterClick, loading }: Props) => {
  const groupFilter = typeFilter[group.type];
  const filters =
    groupFilter?.filters.filter((filter) => group.resourceTypes.includes(filter.id) || filter.id === "all") ?? [];
  const toCount = groupFilter ? groupFilter?.page * groupFilter.pageSize : 0;

  return (
    <BaseSearchGroup
      loading={loading}
      groupType={group.type}
      totalCount={group.totalCount}
      toCount={toCount}
      handleShowMore={handleShowMore}
    >
      {groupFilter?.filters.length ? (
        <StyledCheckboxGroup onValueChange={(v) => handleSubFilterClick(group.type, v)} value={groupFilter.selected}>
          {filters.map((filter) => (
            <CheckboxRoot key={filter.id} value={filter.id} variant="chip">
              <CheckboxControl>
                <CheckboxIndicator asChild>
                  <CheckLine />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxLabel>{filter.name}</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
          ))}
        </StyledCheckboxGroup>
      ) : null}
      <SearchResultsList>
        {group.items.slice(0, toCount).map((item) => (
          <SearchResultItem item={item} key={item.id} type={group.type} />
        ))}
      </SearchResultsList>
    </BaseSearchGroup>
  );
};

interface BaseSearchProps {
  children: ReactNode;
  loading: boolean;
  groupType: string;
  totalCount: number;
  toCount: number;
  handleShowMore: (type: string) => void;
}
export const BaseSearchGroup = ({
  children,
  loading,
  groupType,
  totalCount,
  toCount,
  handleShowMore,
}: BaseSearchProps) => {
  const { t } = useTranslation();
  const headingId = useId();

  const onToTopHandler = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Wrapper key={`searchresult-${groupType}`}>
      <HeaderWrapper>
        <Heading textStyle="title.large" id={headingId} asChild consumeCss>
          <h2>{groupType ? t(`contentTypes.${groupType}`) : t("searchPage.resultType.allContentTypes")}</h2>
        </Heading>
        {!!totalCount && <Text textStyle="label.large">{t("searchPage.resultType.hits", { count: totalCount })}</Text>}
      </HeaderWrapper>
      {children}
      <PaginationWrapper>
        <Text textStyle="label.medium">
          {toCount < totalCount
            ? t("searchPage.resultType.showing", {
                count: toCount,
                totalCount: totalCount,
                contentType: "",
              })
            : t("searchPage.resultType.showingAll")}
        </Text>
        <ProgressBar>
          <Progress style={{ "--width": `${Math.ceil((toCount / totalCount) * 100)}%` } as CSSProperties} />
        </ProgressBar>
        {loading && <Spinner />}
        {toCount < totalCount ? (
          <Button variant="secondary" aria-describedby={headingId} onClick={() => handleShowMore(groupType)}>
            {t("searchPage.resultType.showMore")}
          </Button>
        ) : (
          <Button variant="secondary" onClick={onToTopHandler}>
            {t("searchPage.resultType.toTopOfPage")}
          </Button>
        )}
      </PaginationWrapper>
    </Wrapper>
  );
};
