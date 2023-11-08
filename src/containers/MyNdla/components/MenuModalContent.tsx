/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, fonts, colors } from '@ndla/core';
import { FourlineHamburger, List } from '@ndla/icons/action';
import {
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
} from '@ndla/modal';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useOutletContext } from 'react-router-dom';
import { ViewType } from '../Folders/FoldersPage';
import { OutletContext, menuLinks } from '../MyNdlaLayout';
import NavigationLink from './NavigationLink';

const MenuItem = styled.li`
  list-style: none;
  flex-basis: 24%;
  margin: unset;
`;

const Title = styled.div`
  text-transform: uppercase;
  padding: ${spacing.normal} ${spacing.small} ${spacing.small} ${spacing.small};
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  color: ${colors.brand.grey};

  &[data-border-top='true'] {
    border-top: 1px solid ${colors.brand.lightest};
  }

  &[data-no-padding-top='true'] {
    padding-top: unset;
  }

  &[data-blue-background='true'] {
    background: ${colors.background.lightBlue};
  }
`;

const MenuItems = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: space-between;
  padding: unset;
  margin: unset;
  padding-bottom: ${spacing.small};
  border-bottom: 1px solid ${colors.brand.lighter};

  background: ${colors.background.lightBlue};
`;

const ToolMenu = styled.div`
  display: flex;
  flex-direction: column;

  padding: unset;
  margin: unset;

  button,
  a {
    border-top: 0.5px solid ${colors.brand.greyLighter};
    padding: ${spacing.small} ${spacing.normal};
    &:last-child {
      border-bottom: 0.5px solid ${colors.brand.greyLighter};
    }
  }
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  padding: 0 0 ${spacing.normal} 0;
`;

const StyledModalHeader = styled(ModalHeader)`
  background: ${colors.background.lightBlue};
`;

const ViewButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  padding-left: ${spacing.small};
`;

const ViewButton = styled(IconButtonV2)`
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  ${fonts.sizes('10px', '12px')};

  width: 75px;

  background-color: transparent;
  color: ${colors.brand.primary};
  border-radius: ${spacing.xxsmall};
  border-color: ${colors.brand.light};

  &[aria-current='true'] {
    background-color: ${colors.brand.lightest};
  }
`;

interface Props {
  onViewTypeChange?: (val: ViewType) => void;
  viewType?: ViewType;
  buttons?: ReactNode;
  focusId?: string;
}

const MenuModalContent = ({ onViewTypeChange, viewType, buttons }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setIsOpen, resetFocus, setResetFocus } =
    useOutletContext<OutletContext>();

  const links = useMemo(
    () =>
      menuLinks(t, location).map(
        ({ id, shortName, icon, to, name, iconFilled }) => (
          <MenuItem key={id}>
            <NavigationLink
              id={id}
              to={to}
              name={name}
              icon={icon}
              shortName={shortName}
              iconFilled={iconFilled}
              onClick={() => setIsOpen(false)}
            />
          </MenuItem>
        ),
      ),
    [t, location, setIsOpen],
  );

  const onCloseModal = useCallback(
    (e: Event) => {
      if (resetFocus) {
        e.preventDefault();
        setResetFocus(false);
      }
      if (location.pathname !== window.location.pathname) {
        document.getElementById('titleAnnouncer')?.focus();
      }
    },
    [resetFocus, setResetFocus, location],
  );

  return (
    <ModalContent onCloseAutoFocus={onCloseModal}>
      <StyledModalHeader>
        <ModalCloseButton title={t('close')} />
      </StyledModalHeader>
      <StyledModalBody>
        <Title data-no-padding-top={true} data-blue-background={true}>
          {t('myNdla.myNDLA')}
        </Title>
        <nav>
          <MenuItems role="tablist">{links}</MenuItems>
        </nav>
        {buttons && (
          <>
            <Title data-border-top={true}>{t('myNdla.tools')}</Title>
            <ToolMenu>{buttons}</ToolMenu>
          </>
        )}
        {!!viewType && (
          <>
            <Title>{t('myNdla.selectView')}</Title>
            <ViewButtonWrapper>
              <ViewButton
                aria-label={t('myNdla.listView')}
                aria-current={viewType === 'list'}
                onClick={() => onViewTypeChange?.('list')}
              >
                <FourlineHamburger />
                {t('myNdla.simpleList')}
              </ViewButton>
              <ViewButton
                aria-label={t('myNdla.detailView')}
                aria-current={viewType === 'listLarger'}
                onClick={() => onViewTypeChange?.('listLarger')}
              >
                <List />
                {t('myNdla.detailedList')}
              </ViewButton>
            </ViewButtonWrapper>
          </>
        )}
      </StyledModalBody>
    </ModalContent>
  );
};

export default MenuModalContent;
