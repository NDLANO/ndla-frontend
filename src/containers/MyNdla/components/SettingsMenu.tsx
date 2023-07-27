/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent } from 'react';
import styled from '@emotion/styled';
import { isMobile, isTablet } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { IconButtonV2, ButtonV2 } from '@ndla/button';
import { Drawer, ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { HorizontalMenu } from '@ndla/icons/contentType';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '@ndla/dropdown-menu';

export interface MenuItemProps {
  icon?: ReactNode;
  text?: string;
  disabled?: boolean;
  onClick: (e?: MouseEvent<HTMLElement>) => void;
  type?: 'danger';
}

interface Props {
  menuItems?: MenuItemProps[];
  children?: (close: () => void) => ReactNode;
}

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 20%;
  }
`;

const StyledUl = styled.ul`
  padding: 0;
  list-style: none;
`;

const StyledModalBody = styled(ModalBody)`
  padding: 0 0 ${spacing.large} 0px;
`;

const StyledLi = styled.li`
  border-bottom: 1px solid ${colors.brand.neutral7};
`;

const DropdownTriggerButton = styled(IconButtonV2)`
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  &:hover,
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: transparent;
    background-color: transparent;
    svg {
      background-color: ${colors.brand.light};
      border-radius: 50%;
    }
  }
`;

const ItemButton = styled(ButtonV2)`
  display: flex;
  align-items: center;
  color: ${colors.text.primary};
  ${fonts.sizes('16px', '16px')};
  justify-content: flex-start;
  &[data-danger='true'] {
    color: ${colors.support.red};
    &:hover,
    &:focus-within,
    &:focus,
    &:focus-visible {
      color: ${colors.white};
    }
  }
`;

const SettingsMenu = ({ menuItems, children }: Props) => {
  const { t } = useTranslation();
  if (!menuItems?.length) return;
  if (isMobile || isTablet) {
    return (
      <StyledDrawer
        expands
        position="bottom"
        size="small"
        activateButton={
          <IconButtonV2
            aria-label={t('myNdla.more')}
            colorTheme="light"
            variant="ghost"
          >
            <HorizontalMenu />
          </IconButtonV2>
        }
      >
        {(close) => (
          <>
            <ModalHeader>
              <h1>{t('myNdla.settings')}</h1>
              <ModalCloseButton onClick={close} />
            </ModalHeader>
            <StyledModalBody>
              {children?.(close)}
              {!!menuItems?.length && (
                <StyledUl>
                  {menuItems.map((item, i) => (
                    <StyledLi key={i}>
                      <ButtonV2
                        fontWeight="normal"
                        variant="ghost"
                        colorTheme={item.type}
                        onClick={(e) => {
                          close();
                          item.onClick(e);
                        }}
                      >
                        {item.icon}
                        {item.text}
                      </ButtonV2>
                    </StyledLi>
                  ))}
                </StyledUl>
              )}
            </StyledModalBody>
          </>
        )}
      </StyledDrawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownTrigger>
        <DropdownTriggerButton
          aria-label={t('myNdla.more')}
          colorTheme="light"
          variant="ghost"
        >
          <HorizontalMenu />
        </DropdownTriggerButton>
      </DropdownTrigger>
      <DropdownContent showArrow side="bottom" align="end">
        {menuItems.map((item) => (
          <DropdownItem key={item.text}>
            <ItemButton
              colorTheme={item.type ?? 'light'}
              disabled={item.disabled}
              shape="sharp"
              variant="ghost"
              size="small"
              fontWeight="normal"
              data-danger={item.type === 'danger'}
              onClick={item.onClick}
            >
              {item.icon}
              {item.text}
            </ItemButton>
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
