import React, { Fragment } from 'react';
import { SearchFilter, SearchPopoverFilter, Button } from 'ndla-ui';
import { Additional } from 'ndla-icons/common';

const SearchFilters = () => {
  return (
    <Fragment>
      <SearchFilter
        label="Medieuttrykk og mediasamfunnet"
        options={[
          {
            title: 'Medieuttrykk',
            value: 'value',
          },
          {
            title: 'Mediesamfunnet',
            value: 'value2',
          },
        ]}
        values={['value']}>
        <SearchPopoverFilter
          messages={{
            backButton: 'Tilbake til filter',
            filterLabel: 'Velg fag',
            closeButton: 'Lukk',
            confirmButton: 'Bruk fag',
            hasValuesButtonText: 'Bytt fag',
            noValuesButtonText: 'Velg fag',
          }}
          options={[
            {
              title: 'Kinesisk',
              value: 'value1',
            },
            {
              title: 'Brønnteknikk',
              value: 'value2',
            },
            {
              title: 'Markedsføring og ledelse',
              value: 'value3',
            },
            {
              title: 'Naturbruk',
              value: 'value4',
            },
          ]}
          values={[]}
        />
      </SearchFilter>
      <SearchFilter
        label="Innholdstype"
        narrowScreenOnly
        defaultVisibleCount={3}
        showLabel="Flere innholdstyper"
        hideLabel="Færre innholdstyper"
        options={[
          {
            title: 'Læringssti',
            value: 'LEARNING_PATH',
          },
          {
            title: 'Fagstoff',
            value: 'SUBJECT_MATERIAL',
          },
          {
            title: 'Oppgaver og aktiviteter',
            value: 'TASKS_AND_ACTIVITIES',
          },
          {
            title: 'Ekstern læringsressurs',
            value: 'EXTERNAL_LEARNING_RESOURCES',
          },
          {
            title: 'Kildemateriale',
            value: 'SOURCE_MATERIAL',
          },
        ]}
        values={['LEARNING_PATH']}
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
        values={[]}
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
        values={['additional']}
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
        values={['nb']}
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
        values={['ndla']}
      />
      <Button outline>Vis flere filter</Button>
    </Fragment>
  );
};

export default SearchFilters;
