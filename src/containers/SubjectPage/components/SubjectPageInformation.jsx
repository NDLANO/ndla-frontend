/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import SubjectTopical from './SubjectTopical';
import SubjectPageAbout from './SubjectPageAbout';

export const SubjectPageInformation = ({
  subjectpage: { topical, about },
  twoColumns,
  wide,
}) => [
  <SubjectTopical
    key="subjectpage_information_topical"
    twoColumns={twoColumns}
    topical={topical}
  />,
  <SubjectPageAbout
    key="subjectpage_information_about"
    twoColumns={twoColumns}
    about={about}
    wide={wide}
  />,
];

SubjectPageInformation.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
  twoColumns: PropTypes.bool,
  wide: PropTypes.bool,
};

SubjectPageInformation.defaultProps = {
  subjectpage: {},
  twoColumns: false,
  wide: false,
};

export default SubjectPageInformation;
