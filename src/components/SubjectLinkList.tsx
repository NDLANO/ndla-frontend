/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import SafeLink from '@ndla/safelink';
import { toSubject } from '../routeHelpers';
import { GQLSubjectInfoFragment } from '../graphqlTypes';

interface Props {
  subjects?: GQLSubjectInfoFragment[];
}

const SubjectLinkList = ({ subjects = [] }: Props) => (
  <ul className="o-list--arrows">
    {subjects.map(subject => (
      <li key={subject.id}>
        <SafeLink to={toSubject(subject.id)}>{subject.name}</SafeLink>
      </li>
    ))}
  </ul>
);

export default SubjectLinkList;
