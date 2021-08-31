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

import { getProgrammes } from '../../util/programmesSubjectsHelper';
import { getSubjectsCategories } from '../../data/subjects';
import { SubjectShape } from '../../shapes';

const FrontpageSubjects = ({ locale, subjects }) => (
  <FrontpageProgramMenu
    programItems={getProgrammes(locale)}
    subjectCategories={getSubjectsCategories(subjects)}
  />
);

FrontpageSubjects.propTypes = {
  locale: PropTypes.string.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default FrontpageSubjects;
