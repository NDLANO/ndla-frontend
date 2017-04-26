/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { SubjectShape } from '../shapes';

const SubjectLinkList = ({ subjects }) => (
  <ul className="o-list--arrows">
    { subjects.map(subject =>
      (<li key={subject.id}>
        <Link to={`/subjects/${subject.id}`}>{ subject.name }</Link>
      </li>),
    )}
  </ul>
);

SubjectLinkList.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default SubjectLinkList;
