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
import { FrontpageProgramMenu } from '@ndla/ui';

import { toProgramme, toSubject } from '../../routeHelpers';
import { subjectsCategories } from '../../data/subjects';
import { programmes } from '../../data/programmes';

const sortBy = (arr, sortByProp = 'name') =>
  arr.sort((a, b) => {
    if (a[sortByProp] < b[sortByProp]) return -1;
    if (a[sortByProp] > b[sortByProp]) return 1;
    return 0;
  });

const createSubjectFilterUrl = (subject, filter) => {
  const baseUrl = `${toSubject(subject.subjectId)}/`;
  if (filter) {
    const filterIds = filter.join(',');
    return `${baseUrl}?filters=${filterIds}`;
  }
  return baseUrl;
};

export const getCategoriesSubjects = locale => {
  return subjectsCategories.map(category => {
    const subjects = category.subjects.map(subject => {
      if (subject.hideOnFrontpage) {
        return null;
      }
      return {
        name: subject.longName[locale],
        url: createSubjectFilterUrl(subject, subject.filters),
      };
    });

    return {
      name: category.name[locale],
      subjects: sortBy(subjects.filter(Boolean)),
    };
  });
};

const createProgrammeUrl = (program, locale) => {
  return toProgramme(program.url[locale]);
};

const getProgrammes = locale => {
  const programmesData = programmes.map(program => {
    return {
      label: program.name[locale],
      url: createProgrammeUrl(program, locale),
    };
  });
  return sortBy(programmesData, 'label');
};

const FrontpageSubjects = ({ locale }) => {
  const categories = getCategoriesSubjects(locale);
  const programmes = getProgrammes(locale);

  return (
    <FrontpageProgramMenu
      programItems={programmes}
      subjectCategories={categories}
    />
  );
};

FrontpageSubjects.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default FrontpageSubjects;
