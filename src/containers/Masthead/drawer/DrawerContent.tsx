/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import {
  GQLDrawerContent_FrontpageMenuFragment,
  GQLDrawerContent_ProgrammePageFragment,
  GQLDrawerContent_SubjectFragment,
} from '../../../graphqlTypes';
import { NewAboutMenu } from './AboutMenu';
import { MenuType } from './drawerMenuTypes';
import ProgrammeMenu from './ProgrammeMenu';
import SubjectMenu from './SubjectMenu';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: string[];
  subject?: GQLDrawerContent_SubjectFragment;
  type: MenuType;
  setFrontpageMenu: Dispatch<
    SetStateAction<GQLDrawerContent_FrontpageMenuFragment[]>
  >;
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
  menuItems: GQLDrawerContent_FrontpageMenuFragment[];
  programmes: GQLDrawerContent_ProgrammePageFragment[];
}

const DrawerContent = ({
  onClose,
  type,
  onCloseMenuPortion,
  topicPath,
  subject,
  setTopicPathIds,
  setFrontpageMenu,
  menuItems,
  programmes,
}: Props) => {
  if (type === 'programme') {
    return (
      <ProgrammeMenu
        programmes={programmes}
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
      <NewAboutMenu
        menuItems={menuItems}
        onClose={onClose}
        setMenu={setFrontpageMenu}
        onCloseMenuPortion={onCloseMenuPortion}
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
  frontpage: gql`
    fragment DrawerContent_FrontpageMenu on FrontpageMenu {
      ...AboutMenu_FrontpageMenu
    }
    ${NewAboutMenu.fragments.frontpage}
  `,
  programmeMenu: gql`
    fragment DrawerContent_ProgrammePage on ProgrammePage {
      ...ProgrammeMenu_ProgrammePage
    }
    ${ProgrammeMenu.fragments.programmeMenu}
  `,
};

export default DrawerContent;
