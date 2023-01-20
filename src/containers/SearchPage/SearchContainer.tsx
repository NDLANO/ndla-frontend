/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import {
  SearchSubjectResult,
  SearchNotionsResult,
  SearchFilterContent,
  LanguageSelector,
  ConceptNotion,
} from '@ndla/ui';
import { spacingUnit } from '@ndla/core';
import { useTranslation } from 'react-i18next';

import SearchHeader from './components/SearchHeader';
import SearchResults, { ViewType } from './components/SearchResults';
import { SearchGroup, sortResourceTypes, TypeFilter } from './searchHelpers';
import {
  GQLConceptSearchConceptFragment,
  GQLSubjectInfoFragment,
} from '../../graphqlTypes';
import { SearchCompetenceGoal, SubjectItem } from './SearchInnerPage';
import { LocaleType } from '../../interfaces';
import { supportedLanguages } from '../../i18n';

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
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
  competenceGoals: SearchCompetenceGoal[];
  subjectItems?: SubjectItem[];
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
}: Props) => {
  const { t, i18n } = useTranslation();
  const [listViewType, setListViewType] = useState<ViewType>('grid');

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
    <main>
      <SearchHeader
        query={query}
        suggestion={suggestion}
        subjectIds={subjectIds}
        handleSearchParamsChange={handleSearchParamsChange}
        subjects={subjects}
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
            <ConceptNotion
              key={concept.id}
              concept={{
                ...concept,
                image: concept.image
                  ? {
                      src: concept.image.url,
                      alt: concept.image.alt,
                    }
                  : undefined,
              }}
            />
          ))}
        </SearchNotionsResult>
      )}
      {subjectItems && subjectItems?.length > 0 && (
        <SearchSubjectResult items={subjectItems} />
      )}
      {searchGroups && searchGroups.length > 0 && (
        <>
          {sortedFilterButtonItems.length > 1 && (
            <SearchFilterContent
              items={sortedFilterButtonItems}
              onFilterToggle={handleFilterToggle}
              onRemoveAllFilters={handleFilterReset}
              viewType={listViewType}
              onChangeViewType={viewType => setListViewType(viewType)}
            />
          )}
          <SearchResults
            showAll={showAll}
            searchGroups={sortedSearchGroups}
            typeFilter={typeFilter}
            handleSubFilterClick={handleSubFilterClick}
            handleShowMore={handleShowMore}
            viewType={listViewType}
            loading={loading}
          />
          {isLti && (
            <StyledLanguageSelector>
              <LanguageSelector
                locales={supportedLanguages}
                onSelect={i18n.changeLanguage}
              />
            </StyledLanguageSelector>
          )}
        </>
      )}
    </main>
  );
};

export default SearchContainer;
