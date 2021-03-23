/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useMemo } from 'react';
import { func, arrayOf, objectOf, object, string, bool } from 'prop-types';
import { Remarkable } from 'remarkable';
import {
  SearchSubjectResult,
  SearchNotionsResult,
  FilterButtons,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';

import {
  SearchItemShape,
  ConceptShape,
  TypeFilterShape,
  SearchGroupShape,
} from '../../shapes';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import { sortResourceTypes } from './searchHelpers';

const SearchContainer = ({
  t,
  handleSearchParamsChange,
  handleFilterClick,
  handleFilterToggle,
  handleFilterReset,
  handleShowMore,
  query,
  subjectItems,
  concepts,
  suggestion,
  typeFilter,
  searchGroups,
  showConcepts,
  setShowConcepts,
  showAll,
  locale,
}) => {
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
        handleSearchParamsChange={handleSearchParamsChange}
        locale={locale}
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
          <SearchResults
            showAll={showAll}
            searchGroups={sortedSearchGroups}
            typeFilter={typeFilter}
            handleFilterClick={handleFilterClick}
            handleShowMore={handleShowMore}
          />
        </>
      )}
    </>
  );
};

SearchContainer.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
  handleFilterClick: func,
  handleFilterToggle: func,
  handleFilterReset: func,
  handleShowMore: func,
  query: string,
  subjectItems: arrayOf(SearchItemShape),
  concepts: arrayOf(ConceptShape),
  suggestion: string,
  typeFilter: objectOf(TypeFilterShape),
  searchGroups: arrayOf(SearchGroupShape),
  showConcepts: bool,
  setShowConcepts: func,
  showAll: bool,
  locale: string,
};

export default injectT(SearchContainer);
