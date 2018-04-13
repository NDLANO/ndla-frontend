import React, { Fragment } from 'react';
import { func, arrayOf, shape, string, number } from 'prop-types';
import { SearchFilter, SearchPopoverFilter, Button } from 'ndla-ui';
import groupBy from '../../../util/groupBy';

const languages = [
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
];

const SearchFilters = ({
  subjects,
  filters,
  filterState,
  onChange,
  enabledTabs,
  t,
}) => {
  const allSubjects = subjects.map(it => ({
    title: it.name,
    value: it.id,
  }));
  console.log(allSubjects)
  console.log(filterState)
  const allFilters = Object.keys(groupBy(filters || [], 'name')).map(filter => ({
    title: filter,
    value: filter,
  }));

  return (
    <Fragment>
      <SearchFilter
        label="Fag"
        options={allSubjects.filter((_, i) => i < 2)}
        onChange={e => onChange(e, 'subjects')}
        values={filterState.subjects}>
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
          values={filterState.subjects}
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
        onChange={e => onChange(e, 'contentTypes')}
      />
      <SearchFilter
        label="Nivå"
        options={allFilters}
        defaultVisibleCount={3}
        showLabel="Flere nivåer"
        hideLabel="Færre nivåer"
        values={filterState.levels}
        onChange={e => onChange(e, 'levels')}
      />
      <SearchFilter
        label="Språk"
        options={languages}
        values={filterState['language-filter']}
        onChange={newValues => onChange(newValues, 'language-filter')}
        defaultVisibleCount={3}
        showLabel="Flere språk"
        hideLabel="Færre språk"
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
  filterState: shape({
    currentTab: string,
    subject: arrayOf(string),
    language: arrayOf(string),
    content: arrayOf(string),
    level: arrayOf(string),
  }),
  onChange: func,
  enabledTabs: arrayOf(string),
};

export default SearchFilters;
