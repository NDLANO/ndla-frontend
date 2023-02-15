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
import { AboutSubType } from './AboutSubMenu';
import { MenuType } from './drawerMenuTypes';
import ProgrammeMenu from './ProgrammeMenu';
import SubjectMenu from './SubjectMenu';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: string[];
  subject?: GQLDrawerContent_SubjectFragment;
  type: MenuType;
  subType?: AboutSubType;
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
  setSubType: Dispatch<SetStateAction<AboutSubType | undefined>>;
}

const DrawerContent = ({
  onClose,
  type,
  onCloseMenuPortion,
  topicPath,
  subject,
  setTopicPathIds,
  subType,
  setSubType,
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
    return (
      <AboutMenu
        onClose={onClose}
        onCloseMenuPortion={onCloseMenuPortion}
        subType={subType}
        setSubType={setSubType}
      />
    );
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
