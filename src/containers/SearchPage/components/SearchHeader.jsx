/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { func, string, arrayOf } from 'prop-types';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { subjectsCategories, getSubjectById } from '../../../data/subjects';
import { programmes as programmesData } from '../../../data/programmes';

const getSubjectCategoriesForLocale = locale => {
  return subjectsCategories.map(category => ({
    name: category.name[locale],
    subjects: category.subjects.map(subject => ({
      id: subject.id,
      name: subject.longName[locale],
    })),
  }));
};

const getProgrammesByLocale = locale => {
  return programmesData.map(programme => ({
    id: programme.url[locale],
    name: programme.name[locale],
  }));
};

const getProgrammeSubjects = locale => {
  const programmeSubjects = {};
  programmesData.forEach(programme => {
    programme.grades.forEach(grade =>
      grade.categories.forEach(category => {
        programmeSubjects[programme.url[locale]] = [
          ...(programmeSubjects[programme.url[locale]] || []),
          ...category.subjects.map(subject => subject.id),
        ];
      }),
    );
  });
  return programmeSubjects;
};

const getSubjectFilterByFilter = filters => {
  return subjectsCategories
    .map(category =>
      category.subjects
        .filter(subject => filters.includes(subject.filters[0]))
        .map(s => s.id),
    )
    .flat();
};

const SearchHeader = ({
  t,
  query,
  suggestion,
  filters,
  programmes,
  handleSearchParamsChange,
  handleNewSearch,
  locale,
}) => {
  const [searchValue, setSearchValue] = useState(query);
  const [subjectFilter, setSubjectFilter] = useState([]);
  const [programmeFilter, setProgrammeFilter] = useState([]);
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectCategoriesForLocale(locale),
    [locale],
  );
  const localeProgrammes = useMemo(() => getProgrammesByLocale(locale), [
    locale,
  ]);
  const programmeSubjects = useMemo(() => getProgrammeSubjects(locale), [
    locale,
  ]);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const subjectFilterUpdate = getSubjectFilterByFilter(filters);
    setProgrammeFilter(programmes);
    const activeProgrammes = programmes.map(id => {
      const programme = localeProgrammes.find(p => p.id === id);
      return {
        value: id,
        name: programme.name,
        title: programme.name,
      };
    });

    setSubjectFilter(subjectFilterUpdate);
    const activeSubjects = subjectFilterUpdate.map(id => {
      const subject = getSubjectById(id);
      return {
        value: id,
        name: subject.longName[locale],
        title: subject.longName[locale],
      };
    });
    setActiveSubjectFilters([...activeProgrammes, ...activeSubjects]);
  }, [filters, programmeSubjects, programmes, localeProgrammes, locale]);

  const onProgrammeValuesChange = values => {
    handleNewSearch();
    handleSearchParamsChange({
      programs: values,
    });
  };

  const onSubjectValuesChange = values => {
    const subjects = [];
    const filters = [];
    values.forEach(id => {
      const { subjectId, filters: subjectFilters } = getSubjectById(id);
      subjects.push(subjectId);
      filters.push(subjectFilters[0]);
    });
    handleNewSearch();
    handleSearchParamsChange({
      subjects,
      filters,
      levels: [],
    });
  };

  const subjectFilterProps = {
    subjectCategories: {
      categories: localeSubjectCategories,
      values: subjectFilter,
      onSubjectValuesChange: onSubjectValuesChange,
    },
    programmes: {
      options: localeProgrammes,
      values: programmeFilter,
      onProgrammeValuesChange: onProgrammeValuesChange,
    },
    messages: {
      filterLabel: t('searchPage.searchFilterMessages.filterLabel'),
      closeButton: t('searchPage.close'),
      buttonText: t('searchPage.searchFilterMessages.noValuesButtonText'),
    },
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleNewSearch();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = value => {
    if (subjectFilter.includes(value)) {
      onSubjectValuesChange(subjectFilter.filter(id => id !== value));
    }
    if (programmeFilter.includes(value)) {
      onProgrammeValuesChange(programmeFilter.filter(id => id !== value));
    }
  };

  return (
    <SearchHeaderUI
      searchPhrase={query}
      searchPhraseSuggestion={suggestion}
      searchPhraseSuggestionOnClick={() =>
        handleSearchParamsChange({ query: suggestion })
      }
      searchValue={searchValue}
      onSearchValueChange={value => setSearchValue(value)}
      onSubmit={handleSearchSubmit}
      activeFilters={{
        filters: activeSubjectFilters,
        onFilterRemove: handleFilterRemove,
      }}
      filters={subjectFilterProps}
    />
  );
};

SearchHeader.propTypes = {
  handleSearchParamsChange: func,
  handleNewSearch: func,
  query: string,
  suggestion: string,
  filters: arrayOf(string),
  programmes: arrayOf(string),
  locale: string,
};

export default injectT(SearchHeader);
