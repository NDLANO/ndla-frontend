/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode, useMemo } from 'react';
import {
  breakpoints,
  colors,
  fonts,
  mq,
  spacing,
  spacingUnit,
} from '@ndla/core';
import { IconButtonV2 } from '@ndla/button';
import { FourlineHamburger, List } from '@ndla/icons/action';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { useLocation, useOutletContext } from 'react-router-dom';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { menuActions, OutletContext } from '../MyNdlaLayout';
import NavigationLink from './NavigationLink';
import { ViewType } from '../Folders/FoldersPage';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${colors.brand.lighter};
  padding: ${spacing.small} ${spacing.large};
  height: ${spacingUnit * 3}px;

  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};

  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const DropdownWrapper = styled.div`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  flex-grow: 1;
  justify-content: space-between;
`;

const MenuItem = styled.li`
  list-style: none;
  flex-basis: 24%;
  margin: unset;
`;

const Title = styled.div`
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

  padding: unset;
  margin: unset;
  padding-bottom: ${spacing.small};
  border-bottom: 1px solid ${colors.brand.lighter};

  background: ${colors.background.lightBlue};
`;

const ToolMenu = styled.ul`
  display: flex;
  flex-direction: column;

  padding: unset;
  margin: unset;
`;

const ToolItem = styled.li`
  list-style: none;
  margin: unset;
  border-top: 0.5px solid ${colors.brand.greyLighter};
  padding: ${spacing.xsmall} ${spacing.normal} ${spacing.xsmall} 0;

  &:last-child {
    border-bottom: 0.5px solid ${colors.brand.greyLighter};
  }
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  padding: unset;
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
  buttons?: ReactNode[];
  dropDownMenu?: ReactNode;
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
}

const Toolbar = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setIsOpen } = useOutletContext<OutletContext>();

  const menuLinks = useMemo(
    () =>
      menuActions(t, location).map(
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

  return (
    <ToolbarContainer>
      <Wrapper>
        <ButtonContainer>{buttons}</ButtonContainer>
        <DropdownWrapper>{dropDownMenu}</DropdownWrapper>
      </Wrapper>
      <ModalContent>
        <StyledModalHeader>
          <ModalCloseButton title={t('close')} />
        </StyledModalHeader>
        <StyledModalBody>
          <Title data-no-padding-top={true} data-blue-background={true}>
            {t('myNdla.myNDLA')}
          </Title>
          <MenuItems>{menuLinks}</MenuItems>
          {buttons && buttons.length > 0 && (
            <>
              <Title data-border-top={true}>{t('myNdla.tools')}</Title>
              <ToolMenu>
                {buttons?.map((button, index) => (
                  <ToolItem key={index}>{button}</ToolItem>
                ))}
              </ToolMenu>
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
    </ToolbarContainer>
  );
};

export default Toolbar;
