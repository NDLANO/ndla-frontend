import React, { Fragment } from 'react';
import { injectT } from 'ndla-i18n';
import { func, arrayOf, shape, string } from 'prop-types';
import { SearchFilter, SearchPopoverFilter } from 'ndla-ui';
import groupBy from '../../../util/groupBy';
import { FilterShape, SubjectShape } from '../../../shapes';

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
  const allFilters = Object.keys(groupBy(filters || [], 'name')).map(
    filter => ({
      title: filter,
      value: filter,
    }),
  );

  const allContentTypes = enabledTabs.map(tab => ({
    title: t(`contentTypes.${tab}`),
    value: tab,
  }));

  const searchFilters = [
    {
      name: 'contentTypes',
      visibleCount: 3,
      narrowScreenOnly: true,
      options: allContentTypes,
    },
    { name: 'levels', visibleCount: 3, options: allFilters },
    { name: 'language-filter', visibleCount: 3, options: languages },
  ];

  return (
    <Fragment>
      <SearchFilter
        label={t('searchPage.label.subjects')}
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
          onChange={e => onChange(e, 'subjects')}
        />
      </SearchFilter>
      {searchFilters.map(searchFilter => (
        <SearchFilter
          key={`filter_${searchFilter.name}`}
          label={t(`searchPage.label.${searchFilter.name}`)}
          narrowScreenOnly={!!searchFilter.narrowScreenOnly}
          defaultVisibleCount={searchFilter.visibleCount || 3}
          showLabel={t(`searchPage.showLabel.${searchFilter.name}`)}
          hideLabel={t(`searchPage.hideLabel.${searchFilter.name}`)}
          options={searchFilter.options}
          values={filterState[searchFilter.name] || []}
          onChange={newValues => onChange(newValues, searchFilter.name)}
        />
      ))}
    </Fragment>
  );
};

SearchFilters.propTypes = {
  subjects: arrayOf(SubjectShape),
  filterState: shape({
    'resource-types': string,
    subjects: arrayOf(string),
    'language-filter': arrayOf(string),
    levels: arrayOf(string),
  }),
  filters: arrayOf(FilterShape),
  onChange: func,
  enabledTabs: arrayOf(string),
};

export default injectT(SearchFilters);
