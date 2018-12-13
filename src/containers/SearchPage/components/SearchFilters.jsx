/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { func, arrayOf, shape, string } from 'prop-types';
import { SearchFilter, SearchPopoverFilter } from '@ndla/ui';
import { FilterShape, SubjectShape } from '../../../shapes';
import supportedLanguages from '../../../util/supportedLanguages';

const SearchFilters = ({
  subjects,
  activeSubjects,
  filterState,
  onChange,
  onContentTypeChange,
  enabledTabs,
  enabledTab,
  t,
}) => {
  const allSubjects = subjects.map(subject => ({
    title: subject.name,
    value: subject.id,
  }));

  const languages = supportedLanguages.map(language => ({
    title: t(`languages.${language}`),
    value: language,
  }));

  const allContentTypes = enabledTabs.map(tab => ({
    title: tab.name,
    value: tab.value,
  }));

  const subjectFilters = [
    ...activeSubjects.map(subject => ({
      name: subject.filterName,
      options: subject.filters.map(filter => ({
        title: filter.name,
        value: filter.name,
      })),
    })),
  ];

  return (
    <Fragment>
      <SearchFilter
        label={t('searchPage.label.subjects')}
        noFilterSelectedLabel={t('searchPage.label.noFilter')}
        options={activeSubjects}
        onChange={(newValues, value) => onChange(newValues, value, 'subjects')}
        values={filterState.subjects || []}>
        {filterState.subjects && (
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
            values={filterState.subjects}
            onChange={(newValues, value) =>
              onChange(newValues, value, 'subjects')
            }
          />
        )}
      </SearchFilter>
      <SearchFilter
        label={t(`searchPage.label.contentTypes`)}
        narrowScreenOnly
        defaultVisibleCount={3}
        showLabel={t(`searchPage.showLabel.contentTypes`)}
        hideLabel={t(`searchPage.hideLabel.contentTypes`)}
        options={allContentTypes}
        values={[enabledTab.value]}
        onChange={(newValues, tab) => onContentTypeChange(tab)}
      />
      {subjectFilters.map(searchFilter => (
        <SearchFilter
          key={`filter_${searchFilter.name}`}
          label={searchFilter.name}
          defaultVisibleCount={5}
          showLabel={t(`searchPage.showLabel.levels`)}
          hideLabel={t(`searchPage.hideLabel.levels`)}
          options={searchFilter.options}
          values={filterState.levels || []}
          onChange={(newValues, value) => onChange(newValues, value, 'levels')}
        />
      ))}
      <SearchFilter
        label={t(`searchPage.label.languageFilter`)}
        defaultVisibleCount={2}
        showLabel={t(`searchPage.showLabel.languageFilter`)}
        hideLabel={t(`searchPage.hideLabel.languageFilter`)}
        options={languages}
        values={filterState.languageFilter || []}
        onChange={(newValues, value) =>
          onChange(newValues, value, 'languageFilter')
        }
      />
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
  filterState: shape({
    contextFilters: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
    page: string,
    resourceTypes: arrayOf(string),
    subjects: arrayOf(string),
  }),
  filters: arrayOf(FilterShape),
  onChange: func,
  onContentTypeChange: func,
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
