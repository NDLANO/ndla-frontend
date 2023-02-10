/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { aboutNdlaLinkGroups, aboutNdlaLinks } from '../../../constants';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

export type AboutSubType = 'whatWeDo' | 'whoAreWe' | 'careers' | 'contactUs';

interface Props {
  subType: AboutSubType;
  onCloseSubMenuPortion: () => void;
}

const AboutSubMenu = ({ subType, onCloseSubMenuPortion }: Props) => {
  const { t } = useTranslation();
  useArrowNavigation(
    true,
    'header-about-sub-ndla',
    undefined,
    onCloseSubMenuPortion,
  );
  return (
    <DrawerPortion>
      <DrawerList id={'about-sub-menu'}>
        <DrawerRowHeader
          id={'about-sub-ndla'}
          title={t(`masthead.menuOptions.about.${subType}`)}
          type="link"
          to={aboutNdlaLinks[subType]}
          onClose={onCloseSubMenuPortion}
        />
        {Object.entries(aboutNdlaLinkGroups[subType]).map(([key, url]) => (
          <DrawerMenuItem key={key} id={key} type="link" to={url}>
            {t(`masthead.menuOptions.about.${key}`)}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

export default AboutSubMenu;
