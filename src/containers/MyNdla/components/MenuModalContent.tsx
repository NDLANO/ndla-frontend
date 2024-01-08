/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useOutletContext } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, colors, fonts } from '@ndla/core';
import { FourlineHamburger, List } from '@ndla/icons/action';
import {
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalTitle,
} from '@ndla/modal';
import { SafeLinkButton } from '@ndla/safelink';
import { Text } from '@ndla/typography';
import NavigationLink from './NavigationLink';
import { BellIcon } from './NotificationButton';
import { AuthContext } from '../../../components/AuthenticationContext';
import { toAllNotifications } from '../Arena/utils';
import { useArenaNotifications } from '../arenaQueries';
import { ViewType, buttonCss } from '../Folders/FoldersPage';
import { OutletContext, menuLinks } from '../MyNdlaLayout';

const MenuItem = styled.li`
  list-style: none;
  padding: unset;
`;

const StyledText = styled(Text)`
  text-transform: uppercase;
  padding: ${spacing.normal} ${spacing.small} ${spacing.small} ${spacing.small};
  color: ${colors.brand.grey};
  font-weight: ${fonts.weight.bold};

  &[data-border-top='true'] {
    border-top: 1px solid ${colors.brand.lightest};
  }

  &[data-no-padding-top='true'] {
    padding-top: unset;
  }
`;

const StyledModalTitle = styled(ModalTitle)`
  color: ${colors.brand.grey} !important;
  padding: unset;
`;

const MenuItems = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 1fr));
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

  background-color: transparent;
  color: ${colors.brand.primary};
  border-radius: ${spacing.xxsmall};
  border-color: ${colors.brand.light};

  &[aria-current='true'] {
    background-color: ${colors.brand.lightest};
  }
`;

const CloseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.brand.primary};
  justify-content: center;
  align-items: center;
`;

interface Props {
  onViewTypeChange?: (val: ViewType) => void;
  viewType?: ViewType;
  buttons?: ReactNode;
  showButtons?: boolean;
}

const MenuModalContent = ({
  onViewTypeChange,
  viewType,
  buttons,
  showButtons = true,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setIsOpen, resetFocus, setResetFocus } =
    useOutletContext<OutletContext>();
  const { user } = useContext(AuthContext);
  const { notifications } = useArenaNotifications({
    skip: !user?.arenaEnabled,
  });
  const links = useMemo(
    () =>
      menuLinks(t, location).map(
        ({ id, shortName, icon, to, name, iconFilled, restricted }) => {
          if (restricted && !user?.arenaEnabled) {
            return null;
          }
          return (
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
          );
        },
      ),
    [t, location, user, setIsOpen],
  );

  const notificationLink = useMemo(
    () => (
      <SafeLinkButton
        variant="ghost"
        colorTheme="lighter"
        to={toAllNotifications()}
        onClick={() => setIsOpen(false)}
        css={buttonCss}
      >
        <BellIcon
          amountOfUnreadNotifications={
            notifications?.filter(({ read }) => !read).length ?? 0
          }
          left={true}
        />
        {t('myNdla.arena.notification.title')}
      </SafeLinkButton>
    ),
    [notifications, setIsOpen, t],
  );

  const onCloseModal = useCallback(
    (e: Event) => {
      if (resetFocus) {
        e.preventDefault();
        setResetFocus(false);
      }
    },
    [resetFocus, setResetFocus],
  );

  return (
    <ModalContent onCloseAutoFocus={onCloseModal}>
      <StyledModalHeader>
        <StyledModalTitle data-no-padding-top={true}>
          {t('myNdla.myNDLA')}
        </StyledModalTitle>
        <CloseWrapper>
          <ModalCloseButton />
          <Text textStyle="meta-text-xxsmall" margin="none">
            {t('close')}
          </Text>
        </CloseWrapper>
      </StyledModalHeader>
      <StyledModalBody>
        <nav aria-label={t('myNdla.myNDLAMenu')}>
          <MenuItems role="tablist">{links}</MenuItems>
        </nav>
        {showButtons && (!!buttons || user?.arenaEnabled) && (
          <>
            <StyledText margin="none" textStyle="meta-text-medium">
              {t('myNdla.tools')}
            </StyledText>
            <ToolMenu>
              {buttons}
              {user?.arenaEnabled && notificationLink}
            </ToolMenu>
          </>
        )}
        {!!viewType && (
          <>
            <StyledText
              data-border-top={showButtons}
              textStyle="meta-text-medium"
              margin="none"
            >
              {t('myNdla.selectView')}
            </StyledText>
            <ViewButtonWrapper>
              <ViewButton
                aria-label={t('myNdla.listView')}
                aria-current={viewType === 'list'}
                onClick={() => onViewTypeChange?.('list')}
              >
                <FourlineHamburger />
                <Text textStyle="meta-text-xxsmall" margin="none">
                  {t('myNdla.simpleList')}
                </Text>
              </ViewButton>
              <ViewButton
                aria-label={t('myNdla.detailView')}
                aria-current={viewType === 'listLarger'}
                onClick={() => onViewTypeChange?.('listLarger')}
              >
                <List />
                <Text textStyle="meta-text-xxsmall" margin="none">
                  {t('myNdla.detailedList')}
                </Text>
              </ViewButton>
            </ViewButtonWrapper>
          </>
        )}
      </StyledModalBody>
    </ModalContent>
  );
};

export default MenuModalContent;
