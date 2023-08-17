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
  GQLDrawerContent_SubjectFragment,
} from '../../../graphqlTypes';
import AboutMenu, { NewAboutMenu } from './AboutMenu';
import { MenuType } from './drawerMenuTypes';
import ProgrammeMenu from './ProgrammeMenu';
import SubjectMenu from './SubjectMenu';
import { useEnableTaxStructure } from '../../../components/TaxonomyStructureContext';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
  topicPath: string[];
  subject?: GQLDrawerContent_SubjectFragment;
  type: MenuType;
  setTopicPathIds: Dispatch<SetStateAction<string[]>>;
  menu?: GQLDrawerContent_FrontpageMenuFragment;
}

const DrawerContent = ({
  onClose,
  type,
  onCloseMenuPortion,
  topicPath,
  subject,
  setTopicPathIds,
  menu,
}: Props) => {
  const taxStructure = useEnableTaxStructure();
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
    if (taxStructure && menu) {
      return (
        <NewAboutMenu
          menu={menu}
          onClose={onClose}
          onCloseMenuPortion={onCloseMenuPortion}
        />
      );
    }
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
  frontpage: gql`
    fragment DrawerContent_FrontpageMenu on FrontpageMenu {
      ...AboutMenu_FrontpageMenu
    }
    ${NewAboutMenu.fragments.frontpage}
  `,
};

export default DrawerContent;
