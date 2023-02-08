/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { aboutNdlaLinks, aboutNdlaUrl } from '../../../constants';
import AboutSubMenu from './AboutSubMenu';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

export type AboutSubType = 'whatWeDo' | 'whoAreWe' | 'careers' | 'contactUs';
interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
  subType?: AboutSubType;
  setSubType: Dispatch<SetStateAction<AboutSubType | undefined>>;
}

const AboutMenu = ({
  onClose,
  onCloseMenuPortion,
  subType,
  setSubType,
}: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const onNavigateRight = useCallback(
    (id: string | undefined) => {
      setSelected(id);
      setSubType(id as AboutSubType);
    },
    [setSubType],
  );

  const onNavigateLeft = useCallback(() => {
    setSelected(undefined);
    onCloseMenuPortion();
  }, [onCloseMenuPortion]);

  useArrowNavigation(
    true,
    'header-about-ndla',
    onNavigateRight,
    onNavigateLeft,
  );

  return (
    <>
      <DrawerPortion>
        <BackButton
          title={t('masthead.menu.goToMainMenu')}
          homeButton
          onGoBack={onClose}
        />
        <DrawerList id="about-menu">
          <DrawerRowHeader
            id={'about-ndla'}
            title={t('masthead.menuOptions.about.title')}
            type="link"
            to={aboutNdlaUrl}
            onClose={onClose}
            active={!selected}
          />
          {Object.entries(aboutNdlaLinks).map(([key]) => (
            <DrawerMenuItem
              key={key}
              id={key}
              type="button"
              onClick={() => setSubType(key as AboutSubType)}
              active={selected === key}>
              {t(`masthead.menuOptions.about.${key}`)}
            </DrawerMenuItem>
          ))}
        </DrawerList>
      </DrawerPortion>
      {subType && (
        <AboutSubMenu
          subType={subType}
          onCloseSubMenuPortion={onCloseMenuPortion} // TODO: HALP
        />
      )}
    </>
  );
};

export default AboutMenu;
