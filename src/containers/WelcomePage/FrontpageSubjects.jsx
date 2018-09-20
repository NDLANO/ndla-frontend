/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FrontpageSubjects as FrontpageSubjectsSection } from 'ndla-ui';
import { toSubject } from '../../routeHelpers';
import {
  GraphQLFrontpageCategoryShape,
  GraphQLSimpleSubjectShape,
} from '../../graphqlShapes';
import config from '../../config';
import { OLD_CATEGORIES_WITH_SUBJECTS } from '../../constants';

export const getAllImportSubjectsCategory = (subjects = []) => ({
  imported: {
    name: 'imported',
    subjects: subjects.map(subject => ({
      text: subject.name,
      url: toSubject(subject.id),
      yearInfo: subject.yearInfo,
    })),
  },
});

const sortByName = arr =>
  arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

function flattenSubjectsFrontpageFilters(subjects) {
  return subjects.reduce((acc, subject) => {
    if (subject.frontpageFilters && subject.frontpageFilters.length > 0) {
      const subjectFilters = subject.frontpageFilters.map(filter => ({
        ...subject,
        name: filter.name,
        id: `${subject.id}?filters=${filter.id}`,
      }));
      return [...acc, ...subjectFilters];
    }
    return [...acc, subject];
  }, []);
}

export const getCategoriesWithAllSubjects = (
  categoriesFromApi = [],
  locale,
) => {
  // en is only valid for english nodes in old system
  const lang = locale === 'en' ? 'nb' : locale;
  return (
    categoriesFromApi
      .map(category => {
        const flattened = flattenSubjectsFrontpageFilters(category.subjects);
        const newSubjects = flattened.map(categorySubject => ({
          ...categorySubject,
          text: categorySubject.name,
          url: toSubject(categorySubject.id),
          yearInfo: categorySubject.yearInfo,
        }));

        const oldSubjects = OLD_CATEGORIES_WITH_SUBJECTS[category.name]
          .map(subject => ({
            ...subject,
            id: subject.nodeId,
            text: subject.name,
            url: subject.lang
              ? `/${subject.lang}/node/${subject.nodeId}`
              : `/${lang}/node/${subject.nodeId}`,
            yearInfo: subject.yearInfo,
          }))
          .filter(
            oldSubject =>
              newSubjects.find(newSubject =>
                oldSubject.name.startsWith(newSubject.name),
              ) === undefined,
          );
        return {
          [category.name]: {
            ...category,
            subjects: sortByName([...oldSubjects, ...newSubjects]),
          },
        };
      })
      /*
  * NOTE: This reducer is needed in order to fit with the updated object
  * structure in ndla-ui.
  *
  * Transform an array of categories to an object with list of categories.
  *
  * */
      .reduce(
        (obj, category) => ({
          ...obj,
          [category[Object.keys(category)].name]:
            category[Object.keys(category)],
        }),
        {},
      )
  );
};

const FrontpageSubjects = ({ categories, subjects, locale }) => {
  const frontpageCategories = getCategoriesWithAllSubjects(categories, locale);

  const allSubjects = config.isNdlaProdEnvironment
    ? { ...frontpageCategories }
    : {
        ...frontpageCategories,
        ...getAllImportSubjectsCategory(subjects),
      };

  return <FrontpageSubjectsSection subjects={allSubjects} />;
};

FrontpageSubjects.propTypes = {
  locale: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(GraphQLFrontpageCategoryShape),
  subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
};

FrontpageSubjects.defaultProps = {
  categories: [],
};

export default FrontpageSubjects;
