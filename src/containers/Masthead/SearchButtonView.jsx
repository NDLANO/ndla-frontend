import React from 'react';
import { bool, func, arrayOf, object, shape, string } from 'prop-types';
import { ToggleSearchButton, SearchOverlay, SearchField } from 'ndla-ui';
import queryString from 'query-string';
import { injectT } from 'ndla-i18n';
import { searchResultToLinkProps } from '../SearchPage/searchHelpers';

const SearchButtonView = ({
  searchIsOpen,
  openToggle,
  subject,
  query,
  filters,
  onFilterRemove,
  onChange,
  results,
  onSearch,
  t,
}) => {
  const searchString = queryString.stringify({
    query: query && query.length > 0 ? query : undefined,
    subjects: subject ? subject.id : undefined,
  });
  return (
    <ToggleSearchButton
      isOpen={searchIsOpen}
      onToggle={openToggle}
      messages={{ buttonText: t('searchPage.search') }}>
      {(onClose, isOpen) => (
        <SearchOverlay close={onClose} isOpen={isOpen}>
          <SearchField
            placeholder={t('searchPage.searchFieldPlaceholder')}
            value={query}
            onChange={event => {
              onChange(event.target.value);
            }}
            onSearch={onSearch}
            resourceToLinkProps={res => searchResultToLinkProps(res, results)}
            filters={filters}
            onFilterRemove={onFilterRemove}
            messages={{
              contentTypeResultShowMoreLabel: t(
                'searchPage.searchField.contentTypeResultShowMoreLabel',
              ),
              contentTypeResultShowLessLabel: t(
                'searchPage.searchField.contentTypeResultShowLessLabel',
              ),
              allResultButtonText: t(
                'searchPage.searchField.allResultButtonText',
              ),
              searchFieldTitle: t('searchPage.search'),
              searchResultHeading: t(
                'searchPage.searchField.searchResultHeading',
              ),
              contentTypeResultNoHit: t(
                'searchPage.searchField.contentTypeResultNoHit',
              ),
            }}
            allResultUrl={
              searchString && searchString.length > 0
                ? `/search?${searchString}`
                : '/search'
            }
            searchResult={results}
          />
        </SearchOverlay>
      )}
    </ToggleSearchButton>
  );
};

SearchButtonView.propTypes = {
  searchIsOpen: bool,
  openToggle: func,
  subject: shape({
    id: string,
    name: string,
  }),
  onChange: func,
  onSearch: func,
  query: string,
  onFilterRemove: func,
  results: arrayOf(object),
  filters: arrayOf(object),
};

export default injectT(SearchButtonView);
