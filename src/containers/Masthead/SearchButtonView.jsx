import React from 'react';
import { bool, func, arrayOf, object, shape, number, string } from 'prop-types';
import { ToggleSearchButton, SearchOverlay, SearchField } from 'ndla-ui';

const SearchButtonView = ({
  isOpen,
  openToggle,
  subject,
  filterState,
  updateFilter,
  results,
}) => {
  return (
    <ToggleSearchButton
      isOpen={isOpen}
      onToggle={openToggle}
      messages={{ buttonText: 'Søk' }}>
      <SearchOverlay>
        <SearchField
          placeholder="Søk i fagstoff, oppgaver og aktiviteter eller læringsstier"
          value={filterState.query || ''}
          onChange={event => {
            updateFilter({ query: event.target.value });
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
          allResultUrl={subject ? `/search/${subject.id}` : '/search'}
          searchResult={results}
        />
      </SearchOverlay>
    </ToggleSearchButton>
  );
};

SearchButtonView.propTypes = {
  isOpen: bool,
  openToggle: func,
  subject: shape({
    id: string,
    name: string,
  }),
  filterState: shape({ query: string }),
  updateFilter: func,
  results: arrayOf(object),
};

export default SearchButtonView;
