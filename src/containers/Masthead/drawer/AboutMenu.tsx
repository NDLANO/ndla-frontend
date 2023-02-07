/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  aboutNdlaLinkGroups,
  aboutNdlaLinks,
  aboutNdlaUrl,
} from '../../../constants';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

export type AboutSubType = 'whatWeDo' | 'whoAreWe' | 'careers' | 'contactUs';
interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
}

const AboutMenu = ({ onClose, onCloseMenuPortion }: Props) => {
  const { t } = useTranslation();
  useArrowNavigation(true, 'header-about-ndla', undefined, onCloseMenuPortion);
  const [subType, setSubType] = useState<AboutSubType | undefined>(undefined);

  return (
    <>
      <DrawerPortion>
        <BackButton
          title={t('masthead.menu.goToMainMenu')}
          homeButton
          onGoBack={onCloseMenuPortion}
        />
        <DrawerList id="about-menu">
          <DrawerRowHeader
            id={'about-ndla'}
            title={t('masthead.menuOptions.about.title')}
            type="link"
            to={aboutNdlaUrl}
            onClose={onClose}
          />
          {Object.entries(aboutNdlaLinks).map(([key]) => (
            <DrawerMenuItem
              key={key}
              id={key}
              type="button"
              onClick={() => setSubType(key as AboutSubType)}>
              {t(`masthead.menuOptions.about.${key}`)}
            </DrawerMenuItem>
          ))}
        </DrawerList>
      </DrawerPortion>
      {subType && (
        <DrawerPortion>
          <DrawerList id={'about-sub-menu'}>
            <DrawerRowHeader
              id={'about-sub-ndla'}
              title={t(`masthead.menuOptions.about.${subType}`)}
              type="link"
              to={aboutNdlaLinks[subType]}
              onClose={() => {}}
            />
          </DrawerList>
          {Object.entries(aboutNdlaLinkGroups[subType]).map(([key, url]) => (
            <DrawerMenuItem key={key} id={key} type="link" to={url}>
              {t(`masthead.menuOptions.about.${key}`)}
            </DrawerMenuItem>
          ))}
        </DrawerPortion>
      )}
    </>
  );
};

export default AboutMenu;
