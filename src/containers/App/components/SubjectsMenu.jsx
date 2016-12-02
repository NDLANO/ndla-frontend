/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const SubjectsMenu = ({ subjects }) => (
  <ul className="subject-menu">
    { subjects.map(subject =>
      (<li className="subject-menu--item" key={subject.id}>
        <Link className="subject-menu--link" to={`/subjects/${subject.id}`}>{ subject.name }</Link>
      </li>)
    ) }
  </ul>
);

SubjectsMenu.propTypes = {
  subjects: PropTypes.array.isRequired,
};

export default SubjectsMenu;
