/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { aboutNdlaLinks, aboutNdlaUrl } from '../../../constants';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
}

const AboutMenu = ({ onClose, onCloseMenuPortion }: Props) => {
  const { t } = useTranslation();
  useArrowNavigation(true, 'header-about-ndla', undefined, onCloseMenuPortion);

  return (
    <DrawerPortion>
      <BackButton
        title={t('masthead.menu.goToMainMenu')}
        homeButton
        onGoBack={onCloseMenuPortion}
      />
      <DrawerList id="about-menu">
        <DrawerRowHeader
          id={'about-ndla'}
          title="Om NDLA"
          type="link"
          to={aboutNdlaUrl}
          onClose={onClose}
        />
        {Object.entries(aboutNdlaLinks).map(([key, url]) => (
          <DrawerMenuItem key={key} id={key} type="link" to={url}>
            {t(`masthead.menuOptions.about.${key}`)}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

export default AboutMenu;
