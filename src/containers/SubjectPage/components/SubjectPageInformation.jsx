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
import SubjectPageFlexChild from './SubjectPageFlexChild';

export const SubjectPageInformation = ({
  subjectpage: { topical, about, displayInTwoColumns },
}) => [
  <SubjectPageFlexChild
    key="subjectpage_information_topical"
    displayInTwoColumns={displayInTwoColumns}>
    <SubjectTopical topical={topical} />
  </SubjectPageFlexChild>,
  <SubjectPageFlexChild
    key="subjectpage_information_about"
    displayInTwoColumns={displayInTwoColumns}>
    <SubjectPageAbout about={about} />
  </SubjectPageFlexChild>,
];

SubjectPageInformation.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
};

SubjectPageInformation.defaultProps = {
  subjectpage: {},
};

export default SubjectPageInformation;
