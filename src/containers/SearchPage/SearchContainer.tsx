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
import { styled } from "@ndla/styled-system/jsx";
import { constants, HomeBreadcrumb } from "@ndla/ui";
import SearchHeader from "./components/SearchHeader";
import { BaseSearchGroup, SearchResultGroup, SearchResultsList } from "./components/SearchResults";
import SearchResultSubjectItem from "./components/SearchResultSubjectItem";
import { SearchGroup, sortResourceTypes, TypeFilter } from "./searchHelpers";
import { SearchCompetenceGoal, SearchCoreElements, SubjectItem } from "./SearchInnerPage";
import { groupCompetenceGoals } from "../../components/CompetenceGoals";
import { CompetenceItem, CoreElementType } from "../../components/CompetenceGoalTab";
import { LanguageSelector } from "../../components/LanguageSelector";
import { GQLSubjectInfoFragment } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";

const { contentTypes } = constants;

const StyledLanguageSelector = styled("div", {
  base: { display: "flex", justifyContent: "center", marginBlockEnd: "surface.xxsmall" },
});
const CompetenceWrapper = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "small" },
});

const CompetenceItemWrapper = styled("div", { base: { display: "flex", flexDirection: "column", gap: "xxsmall" } });

const StyledMain = styled("main", { base: { display: "flex", flexDirection: "column", gap: "medium" } });

const BreadcrumbWrapper = styled("div", {
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
    return (showAll || isSelected || group.type === contentTypes.SUBJECT) && !!group.items.length;
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
  subjectItems?: SubjectItem[];
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
  subjectItems,
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
      if (
        searchGroups.find((group) => group.type === cur)?.items?.length ||
        selectedFilters.includes(cur) ||
        (subjectItems?.length && cur === "subject")
      ) {
        return [...acc, { value: cur, label: t(`contentTypes.${cur}`) }];
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

  const displaySubjectItems = !!subjectItems?.length && !subjectIds.length;
  const toCountSubjectItems = typeFilter["subject"] ? typeFilter["subject"].page * typeFilter["subject"].pageSize : 0;

  return (
    <StyledMain>
      {!isLti && (
        <BreadcrumbWrapper>
          <HomeBreadcrumb
            items={[
              {
                name: t("breadcrumb.toFrontpage"),
                to: "/",
              },
              { to: "/search", name: t("searchPage.search") },
            ]}
          />
        </BreadcrumbWrapper>
      )}
      <SearchHeader
        query={query}
        suggestion={suggestion}
        subjectIds={subjectIds}
        handleSearchParamsChange={handleSearchParamsChange}
        subjects={subjects}
        noResults={sortedFilterItems.length === 0}
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
      {loading && searchGroups.length === 0 && (
        <div aria-live="assertive">
          <Spinner />
        </div>
      )}
      <div>
        {sortedFilterItems.length > 1 && (
          <>
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
          </>
        )}
        {displaySubjectItems && (selectedFilters.includes("all") || selectedFilters.includes("subject")) && (
          <BaseSearchGroup
            loading={loading}
            groupType="subject"
            totalCount={subjectItems.length}
            toCount={toCountSubjectItems}
            handleShowMore={handleShowMore}
          >
            <SearchResultsList>
              {subjectItems.slice(0, toCountSubjectItems).map((item) => (
                <SearchResultSubjectItem item={item} key={item.id} />
              ))}
            </SearchResultsList>
          </BaseSearchGroup>
        )}
        {searchGroups && searchGroups.length > 0 && (
          <>
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
          </>
        )}
      </div>
    </StyledMain>
  );
};

export default SearchContainer;
