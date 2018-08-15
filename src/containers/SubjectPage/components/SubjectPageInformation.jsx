/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import SubjectTopical from './SubjectTopical';
import SubjectPageAbout from './SubjectPageAbout';

export const SubjectPageInformation = ({
  subjectpage: { topical, about, displayInTwoColumns },
}) => [
  <SubjectTopical
    key="subjectpage_information_topical"
    displayInTwoColumns={displayInTwoColumns}
    topical={topical}
  />,
  <SubjectPageAbout
    key="subjectpage_information_about"
    displayInTwoColumns={displayInTwoColumns}
    about={about}
  />,
];

SubjectPageInformation.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
};

SubjectPageInformation.defaultProps = {
  subjectpage: {},
};

export default SubjectPageInformation;
