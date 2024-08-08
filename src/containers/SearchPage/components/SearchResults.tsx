/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useCallback, useId } from "react";
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

const StyledSection = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const HeaderWrapper = styled("hgroup", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "medium",
  },
});

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
  base: {
    display: "block",
    background: "stroke.default",
    height: "2px",
    width: "min(var(--width),100%)",
  },
});

const SearchResultsList = styled("ul", {
  base: {
    display: "grid",
    alignItems: "flex-start",
    listStyle: "none",
    gap: "medium",
    gridTemplateColumns: "repeat(1, 1fr)",
    tablet: { gridTemplateColumns: "repeat(2,1fr)" },
    desktop: { gridTemplateColumns: "repeat(3,1fr)" },
  },
});

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

interface Props {
  group: SearchGroup;
  typeFilter: Record<string, TypeFilter>;
  handleSubFilterClick: (type: string, filterIds: string[]) => void;
  handleShowMore: (type: string) => void;
  loading: boolean;
}

export const SearchResultGroup = ({ group, typeFilter, handleShowMore, handleSubFilterClick, loading }: Props) => {
  const { t } = useTranslation();

  const groupFilter = typeFilter[group.type];
  const filters =
    groupFilter?.filters.filter((filter) => group.resourceTypes.includes(filter.id) || filter.id === "all") ?? [];
  const toCount = groupFilter ? groupFilter?.page * groupFilter.pageSize : 0;

  const headingId = useId();

  const onToTopHandler = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <StyledSection key={`searchresult-${group.type}`}>
      <HeaderWrapper>
        <Heading textStyle="title.large" id={headingId} asChild consumeCss>
          <h2>{group.type ? t(`contentTypes.${group.type}`) : t("searchPage.resultType.allContentTypes")}</h2>
        </Heading>
        {!!group.totalCount && (
          <Text textStyle="label.large">{t("searchPage.resultType.hits", { count: group.totalCount })}</Text>
        )}
      </HeaderWrapper>
      {/* TODO: Checkboxgroup should be associated with some kind of label (fieldset or labelledby) */}
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
      <PaginationWrapper>
        <Text textStyle="label.medium">
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
        <div aria-live="polite">{loading && <Spinner aria-label={t("loading")} />}</div>
        {toCount < group.totalCount ? (
          <Button variant="secondary" aria-describedby={headingId} onClick={() => handleShowMore(group.type)}>
            {t("searchPage.resultType.showMore")}
          </Button>
        ) : (
          <Button variant="secondary" onClick={onToTopHandler}>
            {t("searchPage.resultType.toTopOfPage")}
          </Button>
        )}
      </PaginationWrapper>
    </StyledSection>
  );
};
