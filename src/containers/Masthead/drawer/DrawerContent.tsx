/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import { GQLDrawerContent_SubjectFragment } from '../../../graphqlTypes';
import AboutMenu from './AboutMenu';
import { MenuType } from './drawerMenuTypes';
import ProgrammeMenu from './ProgrammeMenu';
import SubjectMenu from './SubjectMenu';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: string[];
  subject?: GQLDrawerContent_SubjectFragment;
  type: MenuType;
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
}

const DrawerContent = ({
  onClose,
  type,
  onCloseMenuPortion,
  topicPath,
  subject,
  setTopicPathIds,
}: Props) => {
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
        subject={subject}
        onClose={onClose}
        onCloseMenuPortion={onCloseMenuPortion}
        topicPathIds={topicPath}
        setTopicPathIds={setTopicPathIds}
      />
    );
  } else {
    return <AboutMenu onCloseMenuPortion={onCloseMenuPortion} />;
  }
};

DrawerContent.fragments = {
  subject: gql`
    fragment DrawerContent_Subject on Subject {
      ...SubjectMenu_Subject
    }
    ${SubjectMenu.fragments.subject}
  `,
};

export default DrawerContent;
