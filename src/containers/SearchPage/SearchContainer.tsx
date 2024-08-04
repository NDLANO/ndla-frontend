/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Done } from "@ndla/icons/editor";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Spinner,
  Text,
  Heading,
} from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb } from "@ndla/ui";
import SearchHeader from "./components/SearchHeader";
import { SearchResultGroup } from "./components/SearchResults";
import { SearchGroup, sortResourceTypes, TypeFilter } from "./searchHelpers";
import { SearchCompetenceGoal, SearchCoreElements } from "./SearchInnerPage";
import { groupCompetenceGoals } from "../../components/CompetenceGoals";
import { CompetenceItem, CoreElementType } from "../../components/CompetenceGoalTab";
import { LanguageSelector } from "../../components/LanguageSelector";
import { GQLSubjectInfoFragment } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";

const mainSearchLayoutStyle = css.raw({ display: "flex", flexDirection: "column", gap: "xxlarge" });

const StyledLanguageSelector = styled("div", {
  base: { display: "flex", justifyContent: "center", marginBlockEnd: "surface.xxsmall" },
});
const CompetenceWrapper = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "small" },
});
const CompetenceItemWrapper = styled("div", { base: { display: "flex", flexDirection: "column", gap: "xxsmall" } });

const SearchPanel = styled("div", { base: { display: "flex", flexDirection: "column", gap: "xsmall" } });

const StyledMain = styled("main", {
  base: { marginBlockStart: "xxlarge", tabletDown: { marginBlockStart: "medium" } },
});

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});
const StyledText = styled(Text, { base: { marginBlockEnd: "small" } });

const filterGroups = (searchGroups: SearchGroup[], selectedFilters: string[]) => {
  const showAll = selectedFilters.includes("all");
  return searchGroups.filter((group) => {
    const isSelected = selectedFilters.includes(group.type);
    return (showAll || isSelected) && !!group.items.length;
  });
};

interface Props {
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  handleSubFilterClick: (type: string, filterIds: string[]) => void;
  handleFilterToggle: (type: string[]) => void;
  handleShowMore: (type: string) => void;
  query?: string;
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
  competenceGoals: SearchCompetenceGoal[];
  coreElements: SearchCoreElements[];
  suggestion?: string;
  typeFilter: Record<string, TypeFilter>;
  searchGroups: SearchGroup[];
  loading: boolean;
  isLti?: boolean;
  selectedFilters: string[];
}
const SearchContainer = ({
  handleSearchParamsChange,
  handleSubFilterClick,
  handleFilterToggle,
  handleShowMore,
  query,
  subjectIds,
  subjects,
  suggestion,
  typeFilter,
  searchGroups,
  loading,
  isLti,
  competenceGoals,
  coreElements,
  selectedFilters,
}: Props) => {
  const { t, i18n } = useTranslation();
  const resourceTypeFilterId = useId();

  const filterButtonItems = Object.keys(typeFilter).reduce(
    (acc, cur) => {
      if (searchGroups.find((group) => group.type === cur)?.items?.length || selectedFilters.includes(cur)) {
        acc.push({ value: cur, label: t(`contentTypes.${cur}`) });
      }
      return acc;
    },
    [{ value: "all", label: t("searchPage.resultType.all") }] as { value: string; label: string }[],
  );

  const sortedFilterItems = sortResourceTypes(filterButtonItems, "value");
  const sortedSearchGroups = sortResourceTypes(searchGroups, "type");
  const filteredSortedSearchGroups = filterGroups(sortedSearchGroups, selectedFilters);
  const competenceGoalsMetadata = groupCompetenceGoals(competenceGoals, false, "LK06");

  const mappedCoreElements: CoreElementType["elements"] = coreElements.map((element) => ({
    title: element.title,
    text: element.description ?? "",
    id: element.id,
    url: "",
  }));

  return (
    <StyledMain css={mainSearchLayoutStyle}>
      {!isLti && (
        <HomeBreadcrumb
          items={[
            {
              name: t("breadcrumb.toFrontpage"),
              to: "/",
            },
            { to: "/search", name: t("searchPage.search") },
          ]}
        />
      )}
      <SearchPanel>
        <SearchHeader
          query={query}
          suggestion={suggestion}
          subjectIds={subjectIds}
          handleSearchParamsChange={handleSearchParamsChange}
          subjects={subjects}
          noResults={!(sortedFilterItems.length > 1)}
          competenceGoals={competenceGoals}
          coreElements={coreElements}
          loading={loading}
        />
        {(!!coreElements.length || !!competenceGoalsMetadata?.length) && (
          <CompetenceWrapper>
            {!!competenceGoalsMetadata?.length && (
              <CompetenceItemWrapper>
                <Heading textStyle="title.large" asChild consumeCss>
                  <h2>{t("competenceGoals.competenceGoalItem.title")}</h2>
                </Heading>
                {competenceGoalsMetadata.map((goal, index) => (
                  <CompetenceItem item={goal} key={index} />
                ))}
              </CompetenceItemWrapper>
            )}
            {!!coreElements?.length && (
              <CompetenceItemWrapper>
                <Heading textStyle="title.large" asChild consumeCss>
                  <h2>{t("competenceGoals.competenceTabCorelabel")}</h2>
                </Heading>
                <CompetenceItem item={{ title: "test", elements: mappedCoreElements }} />
              </CompetenceItemWrapper>
            )}
          </CompetenceWrapper>
        )}
        <div aria-live="assertive">{loading && searchGroups.length === 0 && <Spinner />}</div>
        {sortedFilterItems.length > 1 && (
          <div>
            <StyledText textStyle="title.small" id={resourceTypeFilterId}>
              {t("searchPage.filterSearch")}
            </StyledText>
            <StyledCheckboxGroup
              value={selectedFilters}
              onValueChange={handleFilterToggle}
              aria-labelledby={resourceTypeFilterId}
            >
              {sortedFilterItems.map((item) => (
                <CheckboxRoot key={item.value} value={item.value} variant="chip">
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <Done />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxLabel>{item.label}</CheckboxLabel>
                  <CheckboxHiddenInput />
                </CheckboxRoot>
              ))}
            </StyledCheckboxGroup>
          </div>
        )}
      </SearchPanel>
      {searchGroups && searchGroups.length > 0 && (
        <styled.div css={mainSearchLayoutStyle}>
          {filteredSortedSearchGroups.map((group) => (
            <SearchResultGroup
              key={`searchresultgroup-${group.type}`}
              group={group}
              handleSubFilterClick={handleSubFilterClick}
              handleShowMore={handleShowMore}
              loading={loading}
              typeFilter={typeFilter}
            />
          ))}
          {isLti && (
            <StyledLanguageSelector>
              <LanguageSelector
                items={supportedLanguages}
                onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
              />
            </StyledLanguageSelector>
          )}
        </styled.div>
      )}
    </StyledMain>
  );
};

export default SearchContainer;
