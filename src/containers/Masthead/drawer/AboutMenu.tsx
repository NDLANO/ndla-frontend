/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkType, ndlaLinks } from '../../../constants';
import BackButton from './BackButton';
import { useDrawerContext } from './DrawerContext';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

interface Props {
  onCloseMenuPortion: () => void;
}

const AboutMenu = ({ onCloseMenuPortion }: Props) => {
  return (
    <AboutMenuPortion
      type={ndlaLinks}
      onGoBack={onCloseMenuPortion}
      homeButton
    />
  );
};

interface AboutMenuPortionProps {
  type: LinkType;
  homeButton?: boolean;
  onGoBack: () => void;
}

const PortionWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const AboutMenuPortion = ({
  type,
  homeButton,
  onGoBack,
}: AboutMenuPortionProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LinkType | undefined>(undefined);
  const [initialKey, setInitialKey] = useState(`header-${type.key}`);
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();

  useEffect(() => {
    if (!selected && shouldCloseLevel) {
      onGoBack();
      setLevelClosed();
    }
  }, [selected, shouldCloseLevel, onGoBack, setLevelClosed]);

  const onGoRight = useCallback(
    (id?: string) => {
      if (id) {
        setInitialKey(id);
        setSelected(type.subTypes?.find(t => t.key === id && t.subTypes));
      }
    },
    [type.subTypes],
  );

  const { setFocused } = useArrowNavigation(
    !selected,
    initialKey,
    onGoRight,
    onGoBack,
  );

  const onCloseSelected = useCallback(() => {
    setSelected(undefined);
    setFocused(initialKey);
  }, [initialKey, setFocused]);

  return (
    <PortionWrapper>
      <DrawerPortion>
        <BackButton
          title={t('masthead.menu.goToMainMenu')}
          homeButton={homeButton}
          onGoBack={onGoBack}
        />
        <DrawerList id={`list-${type.key}`}>
          <DrawerRowHeader
            id={type.key}
            title={t(`masthead.menuOptions.about.${type.key}`)}
            type="link"
            to={type.link}
            onClose={onGoBack}
            active={!selected}
          />
          {type.subTypes?.map(link => {
            if (link.subTypes) {
              return (
                <DrawerMenuItem id={link.key} type="link" to={link.link}>
                  {t(`masthead.menuOptions.about.${link.key}`)}
                </DrawerMenuItem>
              );
            }
            return (
              <DrawerMenuItem
                id={link.key}
                active={selected?.key === link.key}
                type="button"
                onClick={() => onGoRight(link.key)}>
                {t(`masthead.menuOptions.about.${link.key}`)}
              </DrawerMenuItem>
            );
          })}
        </DrawerList>
      </DrawerPortion>
      {selected && (
        <AboutMenuPortion type={selected} onGoBack={onCloseSelected} />
      )}
    </PortionWrapper>
  );
};

export default AboutMenu;
