/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { OneColumn } from 'ndla-ui';
import { injectSubjects } from '../SubjectPage/subjectHOCs';

const SubjectsPage = ({ subjects }) => (
  <OneColumn>
    <ul>
      { subjects.map(subject => <li key={subject.id}>{ subject.name }</li>) }
    </ul>
  </OneColumn>
);

SubjectsPage.propTypes = {
  subjects: PropTypes.array.isRequired,
};

export default injectSubjects(SubjectsPage);
