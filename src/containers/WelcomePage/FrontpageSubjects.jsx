/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FrontpageSubjectsSection, FrontpageSubjectsWrapper } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { toSubject } from '../../routeHelpers';
import {
  GraphQLFrontpageCategoryShape,
  GraphQLSimpleSubjectShape,
} from '../../graphqlShapes';
import config from '../../config';
import { NODE_CATEGORIES } from '../../constants';

const getAllImportSubjectsCategory = (subjects = []) => ({
  name: 'imported',
  subjects: subjects.map(subject => ({
    text: subject.name,
    url: toSubject(subject.id),
  })),
});

const getCategories = (categories = [], locale) => {
  // en is only valid for english nodes in old system
  const lang = locale === 'en' ? 'nb' : locale;
  return categories.map(category => {
    const newSubjects = category.subjects.map(categorySubject => ({
      ...categorySubject,
      text: categorySubject.name,
      url: toSubject(categorySubject.id),
    }));
    const oldSubjects = NODE_CATEGORIES[category.name]
      .map(subject => ({
        ...subject,
        id: subject.nodeId,
        text: subject.name,
        url: subject.lang
          ? `https://ndla.no/${subject.lang}/node/${subject.nodeId}`
          : `https://ndla.no/${lang}/node/${subject.nodeId}`,
      }))
      .filter(
        oldSubject =>
          newSubjects.find(newSubject =>
            oldSubject.name.startsWith(newSubject.name),
          ) === undefined,
      );
    return { ...category, subjects: [...oldSubjects, ...newSubjects] };
  });
};

const FrontpageSubjects = ({
  categories,
  subjects,
  expanded,
  locale,
  onExpand,
  t,
}) => {
  const frontpageCategories = getCategories(categories, locale);
  const allCategories = config.isNdlaProdEnvironment
    ? frontpageCategories
    : [...frontpageCategories, getAllImportSubjectsCategory(subjects)];

  return (
    <FrontpageSubjectsWrapper>
      {allCategories.map(category => (
        <FrontpageSubjectsSection
          key={category.name}
          id={category.name}
          expanded={expanded === category.name}
          onExpand={shouldExpand =>
            shouldExpand ? onExpand(category.name) : onExpand(undefined)
          }
          heading={t(`welcomePage.category.${category.name}`)}
          subjects={category.subjects}
        />
      ))}
    </FrontpageSubjectsWrapper>
  );
};

FrontpageSubjects.propTypes = {
  expanded: PropTypes.string,
  locale: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(GraphQLFrontpageCategoryShape),
  subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
};

FrontpageSubjects.defaultProps = {
  categories: [],
};

export default injectT(FrontpageSubjects);
