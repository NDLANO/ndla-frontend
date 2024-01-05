/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';
import { useMemo, useContext, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Location, Outlet, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import {
  Book,
  BookOutlined,
  Forum,
  ForumOutlined,
  HashTag,
  Home,
  HomeOutline,
  LogOut,
  ProfilePerson,
  ProfilePersonOutlined,
} from '@ndla/icons/common';
import { FolderOutlined, HorizontalMenu } from '@ndla/icons/contentType';
import { Folder } from '@ndla/icons/editor';
import { Modal, ModalTrigger } from '@ndla/modal';
import { Text } from '@ndla/typography';
import { MessageBox } from '@ndla/ui';
import NavigationLink from './components/NavigationLink';
import { AuthContext } from '../../components/AuthenticationContext';
import { toHref } from '../../util/urlHelper';

const StyledLayout = styled.div`
  display: flex;
  min-height: 60vh;
  flex-direction: row;
  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
  }
`;

const StyledNavList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 1fr));
  grid-gap: ${spacing.xsmall};
  margin: 0px;
  padding: 0 ${spacing.xsmall} 0 0;
  justify-content: space-between;

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    align-items: flex-start;
  }
`;

const StyledLi = styled.li`
  /* Menubar on phone should only display first 4 
  links and the rest when the modal is open */
  &:not(:nth-of-type(-n + 4)) {
    display: none;
  }

  padding: 0;
  ${mq.range({ from: breakpoints.mobileWide })} {
    display: unset !important;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    width: 100%;
  }
`;

const StyledContent = styled.div`
  width: 100%;
`;

const StyledSideBar = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${colors.brand.lightest};
  background: ${colors.background.lightBlue};
  justify-content: center;

  ${mq.range({ from: breakpoints.mobileWide })} {
    padding: ${spacing.nsmall};
    border-right: 1px solid ${colors.brand.lightest};
    border-bottom: unset;
  }

  ${mq.range({ from: breakpoints.desktop })} {
    justify-content: flex-start;
    gap: ${spacing.normal};
    flex-direction: column;
    min-width: 300px;
    border-right: 1px solid ${colors.brand.lightest};
    border-bottom: unset;
  }
`;

const MessageboxWrapper = styled.div`
  margin-bottom: ${spacing.nsmall};
`;

const MoreButton = styled(IconButtonV2)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${spacing.xxsmall} ${spacing.small};
  gap: ${spacing.xsmall};
  color: ${colors.brand.primary};
  border-radius: ${spacing.xxsmall};

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: none;
  }
`;

export interface OutletContext {
  setResetFocus: Dispatch<SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  resetFocus: boolean;
}

const MyNdlaLayout = () => {
  const { t } = useTranslation();
  const { user, examLock } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [resetFocus, setResetFocus] = useState(false);

  const menuLink = useMemo(
    () =>
      menuLinks(t, location).map(
        ({ name, shortName, id, icon, to, iconFilled, restricted }) => {
          if (restricted && !user?.arenaEnabled) {
            return null;
          }
          return (
            <StyledLi key={id}>
              <NavigationLink
                id={id}
                name={name}
                shortName={shortName}
                icon={icon}
                to={to}
                iconFilled={iconFilled}
              />
            </StyledLi>
          );
        },
      ),
    [location, t, user],
  );

  return (
    <StyledLayout>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <StyledSideBar>
          <nav>
            <StyledNavList>{menuLink}</StyledNavList>
          </nav>
          <ModalTrigger>
            <MoreButton
              variant="stripped"
              aria-label={t('myNdla.iconMenu.more')}
            >
              <HorizontalMenu />
              <Text margin="none" textStyle="meta-text-xxsmall">
                {t('myNdla.iconMenu.more')}
              </Text>
            </MoreButton>
          </ModalTrigger>
        </StyledSideBar>
        <StyledContent>
          {examLock && (
            <MessageboxWrapper>
              <MessageBox>{t('myNdla.examLockInfo')}</MessageBox>
            </MessageboxWrapper>
          )}
          <Outlet context={{ setIsOpen, resetFocus, setResetFocus }} />
        </StyledContent>
      </Modal>
    </StyledLayout>
  );
};

export default MyNdlaLayout;

export const menuLinks = (t: TFunction, location: Location) => [
  {
    id: '',
    name: t('myNdla.myNDLA'),
    shortName: t('myNdla.myNDLA'),
    icon: <HomeOutline />,
    iconFilled: <Home />,
  },
  {
    id: 'folders',
    name: t('myNdla.myFolders'),
    shortName: t('myNdla.iconMenu.folders'),
    icon: <FolderOutlined />,
    iconFilled: <Folder />,
  },
  {
    id: 'subjects',
    name: t('myNdla.favoriteSubjects.title'),
    shortName: t('myNdla.iconMenu.subjects'),
    icon: <BookOutlined />,
    iconFilled: <Book />,
  },
  {
    id: 'tags',
    name: t('myNdla.myTags'),
    shortName: t('myNdla.iconMenu.tags'),
    icon: <HashTag />,
  },
  {
    id: 'arena',
    name: t('myNdla.arena.title'),
    shortName: t('myNdla.arena.title'),
    icon: <ForumOutlined />,
    iconFilled: <Forum />,
    restricted: true,
  },
  {
    id: 'profile',
    name: t('myNdla.myProfile.title'),
    shortName: t('myNdla.iconMenu.profile'),
    icon: <ProfilePersonOutlined />,
    iconFilled: <ProfilePerson />,
  },
  {
    id: 'logout-path',
    name: t('user.buttonLogOut'),
    shortName: t('user.buttonLogOut'),
    icon: <LogOut />,
    to: `/logout?state=${toHref(location)}`,
  },
];
