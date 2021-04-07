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
import { programmes } from '../../../data/programmes';

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
  return programmes.map(programme => ({
    id: programme.url[locale],
    name: programme.name[locale],
  }));
};

const getProgrammeSubjects = locale => {
  const programmeSubjects = {};
  programmes.forEach(programme => {
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

const getSubjectMapping = () => {
  const subjectMapping = {};
  subjectsCategories.forEach(category => ({
    subjects: category.subjects.forEach(subject => {
      subjectMapping[subject.id] = {
        subjectId: subject.subjectId,
        filter: subject.filters[0],
      };
    }),
  }));
  return subjectMapping;
};

const SearchHeader = ({
  t,
  query,
  suggestion,
  filters,
  handleSearchParamsChange,
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
  const subjectMapping = useMemo(() => getSubjectMapping(), []);
  const programmeSubjects = useMemo(() => getProgrammeSubjects(locale), [
    locale,
  ]);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const subjectFilterUpdate = getSubjectFilterByFilter(filters);
    if (programmeSubjects) {
      const programmeFilterUpdate = [];
      for (const [programme, subjects] of Object.entries(programmeSubjects)) {
        if (subjects.every(subject => subjectFilterUpdate.includes(subject))) {
          programmeFilterUpdate.push(programme);
        }
      }
      if (programmeFilterUpdate.length) {
        setSubjectFilter([]);
        setProgrammeFilter(programmeFilterUpdate);
        const activeProgrammes = programmeFilterUpdate.map(id => {
          const programme = localeProgrammes.find(p => p.id === id);
          return {
            value: id,
            name: programme.name,
            title: programme.name,
          };
        });
        setActiveSubjectFilters(activeProgrammes);
      } else {
        setProgrammeFilter([]);
        setSubjectFilter(subjectFilterUpdate);
        const activeSubjects = subjectFilterUpdate.map(id => {
          const subject = getSubjectById(id);
          return {
            value: id,
            name: subject.longName[locale],
            title: subject.longName[locale],
          };
        });
        setActiveSubjectFilters(activeSubjects);
      }
    }
  }, [filters, programmeSubjects, localeProgrammes, locale]);

  const onProgrammeValuesChange = values => {
    const subjectFilterValues = [];
    programmes.forEach(programme => {
      if (values.includes(programme.url[locale])) {
        programme.grades.forEach(grade =>
          grade.categories.forEach(category =>
            category.subjects.forEach(subject => {
              if (!subjectFilterValues.includes(subject.id)) {
                subjectFilterValues.push(subject.id);
              }
            }),
          ),
        );
      }
    });
    onSubjectValuesChange(subjectFilterValues);
  };

  const onSubjectValuesChange = values => {
    const subjects = [];
    const filters = [];
    values.forEach(subject => {
      const { subjectId, filter } = subjectMapping[subject];
      subjects.push(subjectId);
      filters.push(filter);
    });
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
  query: string,
  suggestion: string,
  filters: arrayOf(string),
  locale: string,
};

export default injectT(SearchHeader);
