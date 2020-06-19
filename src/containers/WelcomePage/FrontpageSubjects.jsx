/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { FrontpageCircularSubjectsSection } from '@ndla/ui';

import { toSubject } from '../../routeHelpers';
import { FRONTPAGE_CATEGORIES } from '../../constants';

const sortByName = arr =>
  arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

const createSubjectFilterUrl = (subject, filter) => {
  const baseUrl = `${toSubject(subject.id)}/`;
  if (filter) {
    const filterIds = filter.join(',');
    return `${baseUrl}?filters=${filterIds}`;
  }
  return baseUrl;
};

export const getCategoriesSubjects = () => {
  const data = FRONTPAGE_CATEGORIES.categories;

  return data.map(category => {
    const subjects = category.subjects.map(subject => ({
      ...subject,
      text: subject.name,
      url: createSubjectFilterUrl(subject, subject.filters),
    }));

    return {
      ...category,
      subjects: sortByName(subjects),
    };
  });
};

const FrontpageSubjects = () => {
  const categories = getCategoriesSubjects();

  return (
    <>
      <FrontpageCircularSubjectsSection categories={categories} />
    </>
  );
};

export default FrontpageSubjects;
