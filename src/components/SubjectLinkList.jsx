/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SafeLink from '@ndla/safelink';
import { SubjectShape } from '../shapes';
import { toSubject } from '../routeHelpers';

const SubjectLinkList = ({ subjects }) => (
  <ul className="o-list--arrows">
    {subjects.map(subject => (
      <li key={subject.id}>
        <SafeLink to={toSubject(subject.id)}>{subject.name}</SafeLink>
      </li>
    ))}
  </ul>
);

SubjectLinkList.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default SubjectLinkList;
