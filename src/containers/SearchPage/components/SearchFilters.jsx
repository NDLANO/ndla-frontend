/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { injectT } from 'ndla-i18n';
import { func, arrayOf, shape, string } from 'prop-types';
import { SearchFilter, SearchPopoverFilter } from 'ndla-ui';
import groupBy from '../../../util/groupBy';
import { FilterShape, SubjectShape } from '../../../shapes';
import supportedLanguages from '../../../util/supportedLanguages';

const SearchFilters = ({
  subjects,
  filters,
  filterState,
  onChange,
  onContentTypeChange,
  enabledTabs,
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

  const allFilters = Object.keys(groupBy(filters || [], 'name')).map(
    filter => ({
      title: filter,
      value: filter,
    }),
  );

  const allContentTypes = enabledTabs.map(tab => ({
    title: tab.name,
    value: tab.value,
  }));

  const searchFilters = [
    { name: 'levels', visibleCount: 3, options: allFilters },
    { name: 'language-filter', visibleCount: 3, options: languages },
  ];

  const enabledTab =
    enabledTabs.find(
      tab =>
        filterState['resource-types'] === tab.value ||
        filterState['context-types'] === tab.value,
    ) || enabledTabs[0];

  return (
    <Fragment>
      <SearchFilter
        label={t('searchPage.label.subjects')}
        options={allSubjects.filter((_, i) => i < 2)}
        onChange={(newValues, value) => onChange(newValues, value, 'subjects')}
        values={filterState.subjects}>
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
      {searchFilters.map(searchFilter => (
        <SearchFilter
          key={`filter_${searchFilter.name}`}
          label={t(`searchPage.label.${searchFilter.name}`)}
          defaultVisibleCount={searchFilter.visibleCount || 3}
          showLabel={t(`searchPage.showLabel.${searchFilter.name}`)}
          hideLabel={t(`searchPage.hideLabel.${searchFilter.name}`)}
          options={searchFilter.options}
          values={filterState[searchFilter.name] || []}
          onChange={(newValues, value) =>
            onChange(newValues, value, searchFilter.name)
          }
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
  onContentTypeChange: func,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
};

export default injectT(SearchFilters);
