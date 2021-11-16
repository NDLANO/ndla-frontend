/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { FrontpageProgramMenu } from '@ndla/ui';

import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';

const FrontpageSubjects = ({ locale }) => (
  <FrontpageProgramMenu
    programItems={getProgrammes(locale)}
    subjectCategories={getCategorizedSubjects(locale)}
  />
);

FrontpageSubjects.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default FrontpageSubjects;
