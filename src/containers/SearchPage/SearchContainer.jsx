/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useMemo } from 'react';
import { func, arrayOf, objectOf, object, string, bool } from 'prop-types';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import {
  SearchSubjectResult,
  SearchNotionsResult,
  FilterButtons,
  LanguageSelector,
} from '@ndla/ui';
import { spacingUnit } from '@ndla/core';
import { useTranslation } from 'react-i18next';

import {
  SearchItemShape,
  ConceptShape,
  TypeFilterShape,
  SearchGroupShape,
} from '../../shapes';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import { sortResourceTypes } from './searchHelpers';

const StyledLanguageSelector = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${spacingUnit * 10}px;
`;

const SearchContainer = ({
  handleSearchParamsChange,
  handleSubFilterClick,
  handleFilterToggle,
  handleFilterReset,
  handleShowMore,
  query,
  subjects,
  programmes,
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
}) => {
  const { t, i18n } = useTranslation();
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    return md;
  }, []);
  const renderMarkdown = text => markdown.render(text);

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
        programmes={programmes}
        handleSearchParamsChange={handleSearchParamsChange}
        noResults={sortedFilterButtonItems.length === 0}
        locale={locale}
        competenceGoals={competenceGoals}
      />
      {showConcepts && concepts?.length > 0 && (
        <SearchNotionsResult
          items={concepts}
          totalCount={concepts.length}
          onRemove={() => {
            setShowConcepts(false);
          }}
          renderMarkdown={renderMarkdown}
        />
      )}
      {subjectItems.length > 0 && <SearchSubjectResult items={subjectItems} />}
      {searchGroups.length > 0 && (
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
                options={i18n.supportedLanguages}
                currentLanguage={i18n.language}
              />
            </StyledLanguageSelector>
          )}
        </>
      )}
    </>
  );
};

SearchContainer.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
  handleSubFilterClick: func,
  handleFilterToggle: func,
  handleFilterReset: func,
  handleShowMore: func,
  query: string,
  subjects: arrayOf(string),
  competenceGoals: arrayOf(object),
  programmes: arrayOf(string),
  subjectItems: arrayOf(SearchItemShape),
  concepts: arrayOf(ConceptShape),
  suggestion: string,
  typeFilter: objectOf(TypeFilterShape),
  searchGroups: arrayOf(SearchGroupShape),
  showConcepts: bool,
  setShowConcepts: func,
  showAll: bool,
  locale: string,
  loading: bool.isRequired,
  isLti: bool,
};

export default SearchContainer;
