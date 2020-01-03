/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { func, arrayOf, shape, string } from 'prop-types';
import { SearchFilter, SearchPopoverFilter, SearchFilterList } from '@ndla/ui';
import { Core, Additional } from '@ndla/icons/common';
import { FilterShape, SubjectShape, SearchParamsShape } from '../../../shapes';
import { RELEVANCE_CORE, RELEVANCE_SUPPLEMENTARY } from '../../../constants';

const SearchFilters = ({
  subjects,
  activeSubjects,
  searchParams,
  onChange,
  t,
}) => {
  const allSubjects = subjects
    ? subjects.map(subject => ({
        title: subject.name,
        value: subject.id,
      }))
    : [];

  const relevances = [
    {
      value: RELEVANCE_CORE,
      title: t('searchPage.searchFilterMessages.coreRelevance'),
    },
    {
      value: RELEVANCE_SUPPLEMENTARY,
      title: t('searchPage.searchFilterMessages.supplementaryRelevance'),
    },
  ];

  const subjectFilters = [
    ...activeSubjects.map(subject => ({
      name: subject.filterName,
      options: subject.filters
        ? subject.filters.map(filter => ({
            title: filter.name,
            value: filter.name,
          }))
        : [],
    })),
  ];

  const searchFilterListOptions = activeSubjects.map(subject => ({
    filterName: subject.filterName,
    title: subject.title,
    value: subject.value,
    id: subject.id,
    subjectFilters: subject.filters
      ? subject.filters.map(filter => ({
          title: filter.name,
          value: filter.name,
        }))
      : [],
  }));

  const seachFilterListSubjectValues = {};

  if (searchParams.levels && searchParams.levels.length > 0) {
    searchFilterListOptions.forEach(subject => {
      if (subject.subjectFilters.length > 0) {
        subject.subjectFilters.forEach(filter => {
          if (!seachFilterListSubjectValues[subject.id]) {
            seachFilterListSubjectValues[subject.id] = [];
          }
          if (searchParams.levels && searchParams.levels.length > 0) {
            searchParams.levels.forEach(level => {
              if (level === filter.title) {
                seachFilterListSubjectValues[subject.id].push(filter.value);
              }
            });
          }
        });
      }
    });
  }

  // remove and add new values in sub list
  const changeSubjectValues = (subject, tab, value) => {
    if (!searchParams.levels.includes(value)) {
      onChange([...searchParams.levels, value], value, 'levels');
    } else {
      onChange(
        searchParams.levels.filter(level => level !== value),
        value,
        'levels',
      );
    }
  };
  return (
    <Fragment>
      <SearchFilterList
        label={t('searchPage.label.subjects')}
        options={searchFilterListOptions}
        noFilterSelectedLabel={t('searchPage.label.noFilter')}
        onChange={(newValues, value) => onChange(newValues, value, 'subjects')}
        values={searchParams.subjects || []}
        subjectValues={seachFilterListSubjectValues}
        onSubfilterChange={changeSubjectValues}>
        {searchParams.subjects.length === 0 && (
          <span className={'c-filter__no-filter-selected'}>
            {t('searchPage.label.noFilter')}
          </span>
        )}
        {searchParams.subjects && (
          <SearchPopoverFilter
            messages={{
              backButton: t('searchPage.searchFilterMessages.backButton'),
              filterLabel: t('searchPage.searchFilterMessages.filterLabel'),
              closeButton: t('searchPage.close'),
              confirmButton: t('searchPage.searchFilterMessages.confirmButton'),
              hasValuesButtonText: t(
                'searchPage.searchFilterMessages.hasValuesButtonText',
              ),
              noValuesButtonText: t(
                'searchPage.searchFilterMessages.noValuesButtonText',
              ),
            }}
            options={allSubjects}
            values={searchParams.subjects}
            onChange={(newValues, value) =>
              onChange(newValues, value, 'subjects')
            }
          />
        )}
      </SearchFilterList>
      {subjectFilters.length > 0 && (
        <SearchFilter
          label={t('searchPage.label.content')}
          options={relevances.map(({ title, value }) => ({
            title,
            value,
            icon: value === RELEVANCE_CORE ? Core : Additional,
          }))}
          values={searchParams.relevance}
          onChange={(newValues, value) => {
            onChange(newValues, value, 'relevance');
          }}
        />
      )}
    </Fragment>
  );
};

SearchFilters.propTypes = {
  subjects: arrayOf(SubjectShape),
  activeSubjects: arrayOf(
    shape({
      title: string,
      filterName: string,
      value: string,
    }),
  ),
  searchParams: SearchParamsShape,
  filters: arrayOf(FilterShape),
  onChange: func,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  enabledTab: string.isRequired,
};

export default injectT(SearchFilters);
