/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { Location } from 'history';
import styled from '@emotion/styled';
import {
  SearchSubjectResult,
  SearchNotionsResult,
  //@ts-ignore
  FilterButtons,
  LanguageSelector,
} from '@ndla/ui';
import { spacingUnit } from '@ndla/core';
import { useTranslation } from 'react-i18next';

import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import { SearchGroup, sortResourceTypes, TypeFilter } from './searchHelpers';
import { GQLConceptSearchConceptFragment } from '../../graphqlTypes';
import { SearchCompetenceGoal, SubjectItem } from './SearchInnerPage';
import { LocaleType } from '../../interfaces';
import { getLocaleUrls } from '../../util/localeHelpers';
import ConceptNotion from './components/ConceptNotion';

const StyledLanguageSelector = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${spacingUnit * 10}px;
`;

interface Props {
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  handleSubFilterClick: (type: string, filterId: string) => void;
  handleFilterToggle: (type: string) => void;
  handleFilterReset: () => void;
  handleShowMore: (type: string) => void;
  query?: string;
  subjects: string[];
  competenceGoals: SearchCompetenceGoal[];
  subjectItems: SubjectItem[];
  concepts?: GQLConceptSearchConceptFragment[];
  suggestion?: string;
  typeFilter: Record<string, TypeFilter>;
  searchGroups: SearchGroup[];
  showConcepts: boolean;
  setShowConcepts: (show: boolean) => void;
  showAll: boolean;
  locale: LocaleType;
  loading: boolean;
  isLti?: boolean;
  location?: Location;
}
const SearchContainer = ({
  handleSearchParamsChange,
  handleSubFilterClick,
  handleFilterToggle,
  handleFilterReset,
  handleShowMore,
  query,
  subjects,
  subjectItems,
  concepts,
  suggestion,
  typeFilter,
  searchGroups,
  showConcepts,
  setShowConcepts,
  showAll,
  locale,
  loading,
  isLti,
  competenceGoals,
  location,
}: Props) => {
  const { t, i18n } = useTranslation();

  const filterButtonItems = [];
  for (const [type, values] of Object.entries(typeFilter)) {
    if (searchGroups.find(group => group.type === type)?.items?.length) {
      filterButtonItems.push({
        value: type,
        label: t(`contentTypes.${type}`),
        selected: values.selected,
      });
    }
  }

  const sortedFilterButtonItems = sortResourceTypes(filterButtonItems, 'value');
  const sortedSearchGroups = sortResourceTypes(searchGroups, 'type');

  return (
    <>
      <SearchHeader
        query={query}
        suggestion={suggestion}
        subjects={subjects}
        handleSearchParamsChange={handleSearchParamsChange}
        noResults={sortedFilterButtonItems.length === 0}
        locale={locale}
        competenceGoals={competenceGoals}
      />
      {showConcepts && concepts && concepts.length > 0 && (
        <SearchNotionsResult
          totalCount={concepts.length}
          onRemove={() => {
            setShowConcepts(false);
          }}>
          {concepts.map(concept => (
            <ConceptNotion concept={concept} />
          ))}
        </SearchNotionsResult>
      )}
      {subjectItems.length > 0 && <SearchSubjectResult items={subjectItems} />}
      {searchGroups && searchGroups.length > 0 && (
        <>
          {sortedFilterButtonItems.length > 1 && (
            <FilterButtons
              heading={t(
                'searchPage.searchFilterMessages.resourceTypeFilter.heading',
              )}
              items={sortedFilterButtonItems}
              onFilterToggle={handleFilterToggle}
              onRemoveAllFilters={handleFilterReset}
              labels={{
                openFilter: t(
                  'searchPage.searchFilterMessages.resourceTypeFilter.button',
                ),
              }}
            />
          )}
          <SearchResults
            showAll={showAll}
            searchGroups={sortedSearchGroups}
            typeFilter={typeFilter}
            handleSubFilterClick={handleSubFilterClick}
            handleShowMore={handleShowMore}
            loading={loading}
          />
          {isLti && (
            <StyledLanguageSelector>
              <LanguageSelector
                center
                outline
                alwaysVisible
                options={getLocaleUrls(
                  i18n.language,
                  location ?? window.location,
                )}
                currentLanguage={i18n.language}
              />
            </StyledLanguageSelector>
          )}
        </>
      )}
    </>
  );
};

export default SearchContainer;
