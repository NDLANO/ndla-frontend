/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { breakpoints, fonts, mq, spacing, spacingUnit } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Cross, Grid } from "@ndla/icons/action";
import { ListCircle } from "@ndla/icons/editor";
import { Heading } from "@ndla/typography";
import { LanguageSelector, constants } from "@ndla/ui";

import SearchHeader from "./components/SearchHeader";
import { SearchResultGroup } from "./components/SearchResults";
import SearchSubjectResult from "./components/SearchSubjectResult";
import { SearchGroup, sortResourceTypes, TypeFilter } from "./searchHelpers";
import { SearchCompetenceGoal, SearchCoreElements, SubjectItem } from "./SearchInnerPage";
import { ViewType } from "./searchTypes";
import { groupCompetenceGoals } from "../../components/CompetenceGoals";
import { CompetenceItem, CoreElementType } from "../../components/CompetenceGoalTab";
import { GQLSubjectInfoFragment } from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";

const { contentTypes } = constants;

const StyledLanguageSelector = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${spacingUnit * 10}px;
`;

const StyledHeading = styled(Heading)`
  font-weight: ${fonts.weight.normal};
`;

const CompetenceWrapper = styled.div`
  margin-bottom: ${spacing.normal};
`;

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledButton = styled(ButtonV2)`
  align-self: flex-start;
`;

const ItemWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  flex-wrap: wrap;
  align-items: flex-start;
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const filterGroups = (searchGroups: SearchGroup[], typeFilter: Record<string, TypeFilter>) => {
  return searchGroups.filter((group) => {
    const filter = typeFilter[group.type];
    return (filter?.selected || group.type === contentTypes.SUBJECT) && !!group.items.length;
  });
};

interface Props {
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  handleSubFilterClick: (type: string, filterId: string) => void;
  handleFilterToggle: (type: string) => void;
  handleFilterReset: () => void;
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
  showAll: boolean;
  loading: boolean;
  isLti?: boolean;
}
const SearchContainer = ({
  handleSearchParamsChange,
  handleSubFilterClick,
  handleFilterToggle,
  handleFilterReset,
  handleShowMore,
  query,
  subjectIds,
  subjectItems,
  subjects,
  suggestion,
  typeFilter,
  searchGroups,
  showAll,
  loading,
  isLti,
  competenceGoals,
  coreElements,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState<ViewType>("grid");

  const filterButtonItems = [];
  for (const [type, values] of Object.entries(typeFilter)) {
    if (searchGroups.find((group) => group.type === type)?.items?.length) {
      filterButtonItems.push({
        value: type,
        label: t(`contentTypes.${type}`),
        selected: values.selected,
      });
    }
  }

  const sortedFilterButtonItems = sortResourceTypes(filterButtonItems, "value");
  const sortedSearchGroups = sortResourceTypes(searchGroups, "type");
  const filteredSortedSearchGroups = showAll ? sortedSearchGroups : filterGroups(sortedSearchGroups, typeFilter);

  const hasSelectedResourceType = sortedFilterButtonItems.some((item) => item.selected);

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
        noResults={sortedFilterButtonItems.length === 0}
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
      <div aria-live="assertive">{loading && searchGroups.length === 0 && <Spinner />}</div>
      {searchGroups && searchGroups.length > 0 && (
        <div>
          {sortedFilterButtonItems.length > 1 && (
            <FilterWrapper>
              <ItemWrapper>
                {sortedFilterButtonItems.map((item) => (
                  <ButtonV2
                    key={item.value}
                    shape="pill"
                    onClick={() => handleFilterToggle(item.value)}
                    colorTheme={item.selected ? "primary" : "greyLighter"}
                  >
                    {item.label}
                    {item.selected && <Cross />}
                  </ButtonV2>
                ))}
              </ItemWrapper>
              <ButtonWrapper>
                <IconButtonV2
                  variant={viewType === "grid" ? "solid" : "ghost"}
                  onClick={() => setViewType("grid")}
                  colorTheme="greyLighter"
                  aria-label={t("searchPage.resultType.gridView")}
                  title={t("searchPage.resultType.gridView")}
                >
                  <Grid />
                </IconButtonV2>
                <IconButtonV2
                  variant={viewType === "list" ? "solid" : "ghost"}
                  onClick={() => setViewType("list")}
                  colorTheme="greyLighter"
                  aria-label={t("searchPage.resultType.listView")}
                  title={t("searchPage.resultType.listView")}
                >
                  <ListCircle />
                </IconButtonV2>
              </ButtonWrapper>
            </FilterWrapper>
          )}
          {hasSelectedResourceType && (
            <StyledButton variant="link" onClick={handleFilterReset}>
              {t(`filterButtons.removeAllFilters`)}
            </StyledButton>
          )}
          {filteredSortedSearchGroups.map((group) => (
            <SearchResultGroup
              key={`searchresultgroup-${group.type}`}
              group={group}
              handleSubFilterClick={handleSubFilterClick}
              handleShowMore={handleShowMore}
              loading={loading}
              typeFilter={typeFilter}
              viewType={viewType}
            />
          ))}
          {isLti && (
            <StyledLanguageSelector>
              <LanguageSelector locales={supportedLanguages} onSelect={i18n.changeLanguage} />
            </StyledLanguageSelector>
          )}
        </div>
      )}
    </StyledMain>
  );
};

export default SearchContainer;
