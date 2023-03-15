/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import SafeLink from '@ndla/safelink';
import { toSubject } from '../routeHelpers';
import { GQLSubjectLinkListSubjectFragment } from '../graphqlTypes';

interface Props {
  subjects?: GQLSubjectLinkListSubjectFragment[];
}

const SubjectLinkList = ({ subjects = [] }: Props) => (
  <ul className="o-list--arrows">
    {subjects.map((subject) => (
      <li key={subject.id}>
        <SafeLink to={toSubject(subject.id)}>{subject.name}</SafeLink>
      </li>
    ))}
  </ul>
);

SubjectLinkList.fragments = {
  subject: gql`
    fragment SubjectLinkListSubject on Subject {
      id
      name
    }
  `,
};

export default SubjectLinkList;
