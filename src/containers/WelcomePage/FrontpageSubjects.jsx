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

const FrontpageSubjects = ({ categories, expanded, onExpand, t }) => {
  const frontpageCategories = categories
    ? categories.map(category => ({
        name: category.name,
        subjects: category.subjects.map(categorySubject => ({
          text: categorySubject.name,
          url: toSubject(categorySubject.id),
        })),
      }))
    : [];

  return (
    <FrontpageSubjectsWrapper>
      {frontpageCategories.map(category => (
        <FrontpageSubjectsSection
          key={category.name}
          id={category.name}
          expanded={expanded === category.name}
          onExpand={onExpand}
          heading={t(`welcomePage.category.${category.name}`)}
          subjects={category.subjects}
        />
      ))}
    </FrontpageSubjectsWrapper>
  );
};

FrontpageSubjects.propTypes = {
  expanded: PropTypes.string,
  onExpand: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      subjects: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
};

export default injectT(FrontpageSubjects);
