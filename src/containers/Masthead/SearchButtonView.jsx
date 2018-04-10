import React from 'react';
import { bool, func, arrayOf, object, shape, string } from 'prop-types';
import { ToggleSearchButton, SearchOverlay, SearchField } from 'ndla-ui';

const SearchButtonView = ({
  isOpen,
  openToggle,
  subject,
  query,
  updateFilter,
  results,
}) => (
  <ToggleSearchButton
    isOpen={isOpen}
    onToggle={openToggle}
    messages={{ buttonText: 'Søk' }}>
    <SearchOverlay>
      <SearchField
        placeholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
        value={query}
        onChange={event => {
          updateFilter(event.target.value);
        }}
        filters={subject ? [{ value: subject.id, title: subject.name }] : []}
        onFilterRemove={() => {}}
        messages={{
          allContentTypeResultLabel: 'Se alle',
          allResultButtonText: 'Vis alle søketreff',
          searchFieldTitle: 'Søk',
          searchResultHeading: 'Forslag:',
          contentTypeResultNoHit: 'Ingen treff',
        }}
        allResultUrl={subject ? `/search?subject=${subject.id}` : '/search'}
        searchResult={results}
      />
    </SearchOverlay>
  </ToggleSearchButton>
);

SearchButtonView.propTypes = {
  isOpen: bool,
  openToggle: func,
  subject: shape({
    id: string,
    name: string,
  }),
  query: string,
  updateFilter: func,
  results: arrayOf(object),
};

export default SearchButtonView;
