import React from 'react';
import { bool, func, arrayOf, object, shape, string } from 'prop-types';
import { ToggleSearchButton, SearchOverlay, SearchField } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { resourceToLinkProps } from '../Resources/resourceHelpers';

const SearchButtonView = ({
  isOpen,
  openToggle,
  subject,
  query,
  filters,
  onFilterRemove,
  onChange,
  results,
  t,
}) => (
  <ToggleSearchButton
    isOpen={isOpen}
    onToggle={openToggle}
    messages={{ buttonText: 'Søk' }}>
    <SearchOverlay>
      <SearchField
        placeholder={t('searchPage.searchFieldPlaceholder')}
        value={query}
        onChange={event => {
          onChange(event.target.value);
        }}
        resourceToLinkProps={resourceToLinkProps}
        filters={filters}
        onFilterRemove={onFilterRemove}
        messages={{
          allContentTypeResultLabel: 'Se alle',
          allResultButtonText: 'Vis alle søketreff',
          searchFieldTitle: 'Søk',
          searchResultHeading: 'Forslag:',
          contentTypeResultNoHit: 'Ingen treff',
        }}
        allResultUrl={subject ? `/search?subjects=${subject.id}` : '/search'}
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
  onChange: func,
  query: string,
  onFilterRemove: func,
  results: arrayOf(object),
  filters: arrayOf(string),
};

export default injectT(SearchButtonView);
