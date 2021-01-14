/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useMemo } from 'react';
import {
  func,
  arrayOf,
  objectOf,
  object,
  string,
  shape,
  bool,
} from 'prop-types';
import { Remarkable } from 'remarkable';
import { SearchSubjectResult, SearchNotionsResult } from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import {
  SearchItemShape,
  ConceptShape,
  TypeFilterShape,
  SearchGroupShape,
} from '../../shapes';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import { filterTypeOptions } from './searchHelpers';

const sortedResourceTypes = [
  'topic-article',
  'subject-material',
  'tasks-and-activities',
  'assessment-resources',
  'external-learning-resources',
  'source-material',
  'learning-path',
];

const SearchContainer = ({
  t,
  handleSearchParamsChange,
  handleFilterClick,
  handleShowMore,
  handleSetSubjectType,
  query,
  subjects,
  allSubjects,
  subjectItems,
  concepts,
  suggestion,
  currentSubjectType,
  typeFilter,
  searchGroups,
  showConcepts,
  setShowConcepts,
}) => {
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    return md;
  }, []);
  const renderMarkdown = text => markdown.render(text);

  return (
    <>
      <SearchHeader
        query={query}
        suggestion={suggestion}
        subjects={subjects}
        allSubjects={allSubjects}
        handleSearchParamsChange={handleSearchParamsChange}
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
        <FilterTabs
          dropdownBtnLabel="Velg"
          value={currentSubjectType ? currentSubjectType : 'ALL'}
          options={filterTypeOptions(searchGroups, t)}
          contentId="search-result-content"
          onChange={handleSetSubjectType}>
          <SearchResults
            searchGroups={searchGroups.sort(
              (a, b) =>
                sortedResourceTypes.indexOf(a.type) -
                sortedResourceTypes.indexOf(b.type),
            )}
            currentSubjectType={currentSubjectType}
            typeFilter={typeFilter}
            handleFilterClick={handleFilterClick}
            handleShowMore={handleShowMore}
          />
        </FilterTabs>
      )}
    </>
  );
};

SearchContainer.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
  handleFilterClick: func,
  handleShowMore: func,
  handleSetSubjectType: func,
  query: string,
  subjects: arrayOf(string),
  allSubjects: arrayOf(
    shape({
      title: string,
      value: string,
    }),
  ),
  subjectItems: arrayOf(SearchItemShape),
  concepts: arrayOf(ConceptShape),
  suggestion: string,
  currentSubjectType: string,
  typeFilter: objectOf(TypeFilterShape),
  searchGroups: arrayOf(SearchGroupShape),
  showConcepts: bool,
  setShowConcepts: func,
};

export default injectT(SearchContainer);
