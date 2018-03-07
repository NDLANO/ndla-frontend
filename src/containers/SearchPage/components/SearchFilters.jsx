import React, { Fragment } from 'react';
import {
  func,
  objectOf,
  arrayOf,
  shape,
  string,
  number,
  array,
} from 'prop-types';
import { SearchFilter, SearchPopoverFilter, Button } from 'ndla-ui';
import { Additional } from 'ndla-icons/common';

const SearchFilters = ({ subjects, filterState, onChange, enabledTabs, t }) => {
  const allSubjects = subjects.map(it => ({
    title: it.name,
    value: it.id,
  }));
  return (
    <Fragment>
      <SearchFilter
        label="Medieuttrykk og mediasamfunnet"
        options={allSubjects.filter((_, i) => i < 2)}
        onChange={e => onChange(e, 'subject')}
        values={filterState.subject}>
        <SearchPopoverFilter
          messages={{
            backButton: 'Tilbake til filter',
            filterLabel: 'Velg fag',
            closeButton: 'Lukk',
            confirmButton: 'Bruk fag',
            hasValuesButtonText: 'Bytt fag',
            noValuesButtonText: 'Velg fag',
          }}
          options={allSubjects}
          values={filterState.subject}
          onChange={e => onChange(e, 'subject')}
        />
      </SearchFilter>
      <SearchFilter
        label="Innholdstype"
        narrowScreenOnly
        defaultVisibleCount={3}
        showLabel="Flere innholdstyper"
        hideLabel="Færre innholdstyper"
        options={enabledTabs.map(it => ({
          title: t(`contentTypes.${it}`),
          value: it,
        }))}
        values={filterState.contentType || []}
        onChange={e => onChange(e, 'contentType')}
      />
      <SearchFilter
        label="Nivå"
        options={[
          {
            title: 'VG1 (15)',
            value: 'VG1',
          },
          {
            title: 'VG2 (20)',
            value: 'VG2',
          },
          {
            title: 'VG3',
            value: 'VG3',
            noResults: true,
          },
        ]}
        values={filterState.level}
        onChange={e => onChange(e, 'level')}
      />
      <SearchFilter
        label="Innhold"
        options={[
          {
            title: 'Tilleggstoff',
            value: 'additional',
            icon: Additional,
          },
        ]}
        values={filterState.content}
        onChange={e => onChange(e, 'content')}
      />
      <SearchFilter
        label="Språk"
        options={[
          {
            title: 'Bokmål',
            value: 'nb',
          },
          {
            title: 'Nynorsk',
            value: 'nn',
          },
          {
            title: 'Engelsk',
            value: 'en',
          },
          {
            title: 'Kinesisk',
            value: 'cn',
          },
        ]}
        values={filterState.language}
        onChange={e => onChange(e, 'language')}
        defaultVisibleCount={3}
        showLabel="Flere språk"
        hideLabel="Færre språk"
      />
      <SearchFilter
        label="Laget av"
        options={[
          {
            title: 'Ndla',
            value: 'ndla',
          },
          {
            title: 'Andre',
            value: 'other',
          },
        ]}
        values={filterState.madeBy || []}
        onChange={e => onChange(e, 'madeBy')}
      />
      <Button outline>Vis flere filter</Button>
    </Fragment>
  );
};

SearchFilters.propTypes = {
  subjects: arrayOf(
    shape({
      name: string,
      id: number,
    }),
  ),
  filterState: objectOf(array),
  onChange: func,
  enabledTabs: arrayOf(string),
};

export default SearchFilters;
