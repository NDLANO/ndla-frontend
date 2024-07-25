/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import emotionStyled from "@emotion/styled";
import { fonts, spacing, spacingUnit } from "@ndla/core";
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
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Heading } from "@ndla/typography";
import { constants } from "@ndla/ui";
import SearchHeader from "./components/SearchHeader";
import { SearchResultGroup } from "./components/SearchResults";
import SearchSubjectResult from "./components/SearchSubjectResult";
import { SearchGroup, sortResourceTypes, TypeFilter } from "./searchHelpers";
import { SearchCompetenceGoal, SearchCoreElements, SubjectItem } from "./SearchInnerPage";
import { groupCompetenceGoals } from "../../components/CompetenceGoals";
import { CompetenceItem, CoreElementType } from "../../components/CompetenceGoalTab";
import { LanguageSelector } from "../../components/LanguageSelector";
import { GQLSubjectInfoFragment } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";

const { contentTypes } = constants;

const StyledLanguageSelector = emotionStyled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${spacingUnit * 10}px;
`;

const StyledHeading = emotionStyled(Heading)`
  font-weight: ${fonts.weight.normal};
`;

const CompetenceWrapper = emotionStyled.div`
  margin-bottom: ${spacing.normal};
`;

const StyledMain = emotionStyled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});
const StyledText = styled(Text, { base: { marginBottom: "small" } });

const filterGroups = (searchGroups: SearchGroup[], selectedFilters: string[]) => {
  const showAll = selectedFilters.includes("all");
  if (showAll) return searchGroups;
  return searchGroups.filter((group) => {
    const isSelected = selectedFilters.includes(group.type);
    return (isSelected || group.type === contentTypes.SUBJECT) && !!group.items.length;
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
      if (searchGroups.find((group) => group.type === cur)?.items?.length || selectedFilters.includes(cur)) {
        return [...acc, { value: cur, label: t(`contentTypes.${cur}`) }];
      }
      return acc;
    },
    [] as { value: string; label: string }[],
  );

  const sortedFilterItems = [{ value: "all", label: t("searchPage.resultType.all") }].concat(
    sortResourceTypes(filterButtonItems, "value"),
  );
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
    <StyledMain>
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
            <>
              <StyledHeading element="h2" headingStyle="list-title">
                {t("competenceGoals.competenceGoalItem.title")}
              </StyledHeading>
              {competenceGoalsMetadata.map((goal, index) => (
                <CompetenceItem item={goal} key={index} showLinks={false} />
              ))}
            </>
          )}
          {!!coreElements?.length && (
            <>
              <StyledHeading element="h2" headingStyle="list-title">
                {t("competenceGoals.competenceTabCorelabel")}
              </StyledHeading>
              <CompetenceItem item={{ title: "test", elements: mappedCoreElements }} showLinks={false} />
            </>
          )}
        </CompetenceWrapper>
      )}
      {subjectItems && subjectItems?.length > 0 && !subjectIds.length && <SearchSubjectResult items={subjectItems} />}
      {loading && searchGroups.length === 0 && (
        <div aria-live="assertive">
          <Spinner />
        </div>
      )}
      {searchGroups && searchGroups.length > 0 && (
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
        </div>
      )}
    </StyledMain>
  );
};

export default SearchContainer;
