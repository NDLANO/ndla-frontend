/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import emotionStyled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { Done } from "@ndla/icons/editor";
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

const Wrapper = emotionStyled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${spacing.normal};
  margin: ${spacing.medium} 0;
  position: relative;
`;

const HeaderWrapper = emotionStyled.hgroup`
  display: flex;
  align-items: center;
  gap: ${spacing.normal};
`;

const PaginationWrapper = emotionStyled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  align-items: center;
`;

const ProgressBar = emotionStyled.div`
  width: 200px;
  height: 2px;
  background: ${colors.brand.tertiary};
  margin: 0 0 ${spacing.small};
`;

const Progress = styled("span", {
  base: { display: "block", background: "stroke.default", height: "2px", width: "min(var(--width),100%)" },
});

const SearchResultsList = emotionStyled.ul`
  display: grid;
  align-items: flex-start;
  list-style: none;
  padding: 0;
  row-gap: ${spacing.normal};
  grid-template-columns: repeat(1, 1fr);
  ${mq.range({ from: breakpoints.tablet })} {
      column-gap: ${spacing.normal};
      grid-template-columns: repeat(2, 1fr);
  }
  ${mq.range({ from: breakpoints.desktop })} {
      grid-template-columns: repeat(3, 1fr);
  }
`;

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});

interface Props {
  group: SearchGroup;
  typeFilter: Record<string, TypeFilter>;
  handleSubFilterClick: (filterIds: string[]) => void;
  handleShowMore: (type: string) => void;
  loading: boolean;
  activeSubFilters: string[];
}

export const SearchResultGroup = ({
  group,
  typeFilter,
  handleShowMore,
  handleSubFilterClick,
  loading,
  activeSubFilters,
}: Props) => {
  const { t } = useTranslation();
  const headingId = useId();
  const filter = typeFilter[group.type];
  const filters = [{ id: "all", name: t("searchPage.resultType.all"), active: true }].concat(
    filter?.filters.filter((filter) => group.resourceTypes.includes(filter.id)) ?? [],
  );
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
        <Heading textStyle="title.large" id={headingId} asChild consumeCss>
          <h2>{group.type ? t(`contentTypes.${group.type}`) : t("searchPage.resultType.allContentTypes")}</h2>
        </Heading>
        {!!group.totalCount && (
          <Text textStyle="label.large">{t("searchPage.resultType.hits", { count: group.totalCount })}</Text>
        )}
      </HeaderWrapper>
      {filter?.filters.length ? (
        <StyledCheckboxGroup onValueChange={handleSubFilterClick} value={activeSubFilters}>
          {filters.map((filter) => (
            <CheckboxRoot key={filter.id} value={filter.id} variant="chip">
              <CheckboxControl>
                <CheckboxIndicator asChild>
                  <Done />
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
        {loading && <Spinner />}
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
    </Wrapper>
  );
};
