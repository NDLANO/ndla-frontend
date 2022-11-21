/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Dispatch, memo, SetStateAction } from 'react';
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
  onCloseMenuPortion: () => void;
  topicPath: string[];
  type: MenuType;
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
}

const drawerQuery = gql`
  query drawerContent($subjectId: String!) {
    subject(id: $subjectId) {
      ...DefaultMenu_Subject
      ...SubjectMenu_Subject
    }
  }
  ${SubjectMenu.fragments.subject}
  ${DefaultMenu.fragments.subject}
`;

const DrawerContent = ({
  onClose,
  type,
  onCloseMenuPortion,
  topicPath,
  setTopicPathIds,
}: Props) => {
  const { subjectId } = useUrnIds();
  const { data } = useGraphQuery<GQLDrawerQuery, GQLDrawerQueryVariables>(
    drawerQuery,
    { variables: { subjectId: subjectId! }, skip: !subjectId },
  );

  if (type === 'programme') {
    return (
      <ProgrammeMenu
        onClose={onClose}
        onCloseMenuPortion={onCloseMenuPortion}
      />
    );
  } else if (type === 'subject') {
    return (
      <SubjectMenu
        subject={data?.subject}
        onClose={onClose}
        onCloseMenuPortion={onCloseMenuPortion}
        topicPathIds={topicPath}
        setTopicPathIds={setTopicPathIds}
      />
    );
  } else {
    return (
      <AboutMenu onClose={onClose} onCloseMenuPortion={onCloseMenuPortion} />
    );
  }
};

export default memo(DrawerContent);
