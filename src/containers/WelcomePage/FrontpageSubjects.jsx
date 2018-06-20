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

const getCategories = (subjects = [], categories = []) =>
  config.showAllFrontpageSubjects
    ? [
        {
          name: 'all',
          subjects: subjects.map(subject => ({
            text: subject.name,
            url: toSubject(subject.id),
          })),
        },
      ]
    : categories.map(category => ({
        name: category.name,
        subjects: category.subjects.map(categorySubject => ({
          text: categorySubject.name,
          url: toSubject(categorySubject.id),
        })),
      }));

const FrontpageSubjects = ({ categories, subjects, expanded, onExpand, t }) => {
  const frontpageCategories = getCategories(subjects, categories);
  return (
    <FrontpageSubjectsWrapper>
      <div data-cy="subject-list">
        {frontpageCategories.map(category => (
          <FrontpageSubjectsSection
            key={category.name}
            data-cy="subject-list"
            id={category.name}
            expanded={expanded === category.name}
            onExpand={onExpand}
            heading={t(`welcomePage.category.${category.name}`)}
            subjects={category.subjects}
          />
        ))}
      </div>
    </FrontpageSubjectsWrapper>
  );
};

FrontpageSubjects.propTypes = {
  expanded: PropTypes.string,
  onExpand: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(GraphQLFrontpageCategoryShape),
  subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
};

FrontpageSubjects.defaultProps = {
  categories: [],
};

export default injectT(FrontpageSubjects);
