/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FrontpageSubjects as FrontpageSubjectsSection } from '@ndla/ui';
import { toSubject } from '../../routeHelpers';
import {
  GraphQLFrontpageCategoryShape,
  GraphQLSimpleSubjectShape,
} from '../../graphqlShapes';
import config from '../../config';
import { FRONTPAGE_CATEGORIES, ALLOWED_SUBJECTS } from '../../constants';

export const getAllImportSubjectsCategory = (subjects = []) => ({
  name: 'imported',
  subjects: subjects.map(subject => ({
    text: subject.name,
    url: toSubject(subject.id),
    yearInfo: subject.yearInfo,
  })),
});

const sortByName = arr =>
  arr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

function findMatchingFrontpageFilter(subjectsFromApi, subject) {
  const subjectFromApi = subjectsFromApi.find(s => s.id === subject.id);
  if (
    subjectFromApi &&
    subjectFromApi.frontpageFilters &&
    subjectFromApi.frontpageFilters.length > 0
  ) {
    const found = subjectFromApi.frontpageFilters.find(
      filter =>
        subject.shortname
          ? subject.shortname.includes(filter.name)
          : subject.name.includes(filter.name),
    );
    return found;
  }
  return undefined;
}

function createSubjectFilterUrl(subject, filter) {
  const baseUrl = toSubject(subject.id);
  if (filter) {
    return `${baseUrl}?filters=${filter.id}`;
  }
  return baseUrl;
}

function findCategoryByName(categoriesFromApi, name) {
  const found = categoriesFromApi.find(category => category.name === name);
  if (found) {
    return found.subjects;
  }
  return [];
}

function isAllowed(subjectId, preview) {
  if (preview) {
    return true;
  }
  return ALLOWED_SUBJECTS.includes(subjectId);
}

function isAllowedNewSubject(subject, preview) {
  if (subject.id && isAllowed(subject.id, preview)) {
    return true;
  }
  return false;
}

export const mapHardCodedCategories = (
  categoriesFromApi = [],
  locale,
  preview = false,
) => {
  // en is only valid for english nodes in old system
  const lang = locale === 'en' ? 'nb' : locale;
  const hardCodedCategories = FRONTPAGE_CATEGORIES.categories;

  return hardCodedCategories.map(category => {
    const subjectsFromApi = findCategoryByName(
      categoriesFromApi,
      category.name,
    );

    const newSubjects = category.subjects.filter(subject =>
      isAllowedNewSubject(subject, preview),
    );
    const oldSubjects = category.subjects
      .filter(subject => !isAllowedNewSubject(subject, preview))
      .filter(subject => subject.nodeId); // N.B. remove new subjects which are not allowed

    const mappedNewSubjects = newSubjects.map(subject => ({
      ...subject,
      text: subject.name,
      url: createSubjectFilterUrl(
        subject,
        findMatchingFrontpageFilter(subjectsFromApi, subject),
      ),
    }));

    const mappedOldSubjects = oldSubjects.map(subject => ({
      ...subject,
      id: subject.nodeId,
      text: subject.name,
      url: subject.lang
        ? `/${subject.lang}/node/${subject.nodeId}`
        : `/${lang}/node/${subject.nodeId}`,
    }));

    return {
      ...category,
      subjects: sortByName([...mappedOldSubjects, ...mappedNewSubjects]),
    };
  });
};

const LinkToAbout = () => (
  <a rel="noopener noreferrer" target="_blank" href="https://om.ndla.no">
    om.ndla.no
  </a>
);

class FrontpageSubjects extends Component {
  constructor(props) {
    super(props);
    this.state = { preview: false };
  }

  componentDidMount() {
    if (
      document.location.search &&
      document.location.search.includes('preview')
    ) {
      this.setState({ preview: true });
    }
  }

  render() {
    const { categories, subjects, locale } = this.props;
    const frontpageCategories = mapHardCodedCategories(
      categories,
      locale,
      this.state.preview,
    );

    const allSubjects = config.isNdlaProdEnvironment
      ? frontpageCategories
      : [...frontpageCategories, getAllImportSubjectsCategory(subjects)];

    return (
      <FrontpageSubjectsSection
        linkToAbout={<LinkToAbout />}
        categories={allSubjects}
      />
    );
  }
}

FrontpageSubjects.propTypes = {
  locale: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(GraphQLFrontpageCategoryShape),
  subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
};

FrontpageSubjects.defaultProps = {
  categories: [],
};

export default FrontpageSubjects;
