/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { memo, useState } from 'react';
import { GQLDrawerQuery, GQLDrawerQueryVariables } from '../../../graphqlTypes';
import { useUrnIds } from '../../../routeHelpers';
import { useGraphQuery } from '../../../util/runQueries';
import AboutMenu from './AboutMenu';
import DefaultMenu from './DefaultMenu';
import { MenuType } from './drawerMenuTypes';
import ProgrammeMenu from './ProgrammeMenu';
import SubjectMenu from './SubjectMenu';

interface Props {
  onClose: () => void;
}

const drawerQuery = gql`
  query drawer($subjectId: String!) {
    subject(id: $subjectId) {
      ...DefaultMenu_Subject
      ...SubjectMenu_Subject
    }
  }
  ${SubjectMenu.fragments.subject}
  ${DefaultMenu.fragments.subject}
`;

const DrawerContent = ({ onClose }: Props) => {
  const [type, setType] = useState<MenuType>('default');
  const { subjectId } = useUrnIds();
  const { data } = useGraphQuery<GQLDrawerQuery, GQLDrawerQueryVariables>(
    drawerQuery,
    { variables: { subjectId: subjectId! }, skip: !subjectId },
  );

  if (type === 'default') {
    return (
      <DefaultMenu
        onClose={onClose}
        setActiveMenu={setType}
        subject={data?.subject}
      />
    );
  } else if (type === 'programme') {
    return <ProgrammeMenu onClose={onClose} />;
  } else if (type === 'subject' && !!data?.subject) {
    return (
      <SubjectMenu
        subject={data.subject}
        onClose={onClose}
        setActiveMenu={setType}
      />
    );
  } else {
    return <AboutMenu />;
  }
};

export default memo(DrawerContent);
