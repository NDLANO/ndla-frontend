/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  useMemo,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  // useEffect,
} from 'react';
import { Location, Outlet, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { MessageBox } from '@ndla/ui';
import { FolderOutlined } from '@ndla/icons/contentType';
import {
  Book,
  BookOutlined,
  Forum,
  ForumOutlined,
  HashTag,
  LogOut,
  ProfilePerson,
  ProfilePersonOutlined,
} from '@ndla/icons/common';
import { Modal, ModalTrigger } from '@ndla/modal';
import { IconButtonV2 } from '@ndla/button';
import { DragHorizontal, Folder } from '@ndla/icons/editor';
import { Text } from '@ndla/typography';
import { TFunction } from 'i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import NavigationLink from './components/NavigationLink';
import { toHref } from '../../util/urlHelper';
// import { usePersonalData } from './userMutations';

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
  }
`;

const StyledLi = styled.li`
  /* Menubar on phone should only display first 4 
  links and the rest when the modal is open */
  &:not(:nth-of-type(-n + 4)) {
    display: none;
  }

  margin: 0;
  ${mq.range({ from: breakpoints.mobileWide })} {
    display: unset !important;
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
  padding: ${spacing.small};
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
  // const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const { t } = useTranslation();
  // const { authenticated, examLock } = useContext(AuthContext);
  const { examLock } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [resetFocus, setResetFocus] = useState(false);

  // useEffect(() => {
  //   if (authenticated) {
  //     fetchPersonalData();
  //   }
  // }, [authenticated, fetchPersonalData]);

  const menuLink = useMemo(
    () =>
      menuLinks(t, location).map(
        ({ name, shortName, id, icon, to, iconFilled }) => (
          <StyledLi key={id} role="none">
            <NavigationLink
              id={id}
              name={name}
              shortName={shortName}
              icon={icon}
              to={to}
              iconFilled={iconFilled}
            />
          </StyledLi>
        ),
      ),
    [location, t],
  );

  return (
    <StyledLayout>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <StyledSideBar>
          <nav>
            <StyledNavList role="tablist">{menuLink}</StyledNavList>
          </nav>
          <ModalTrigger>
            <MoreButton
              variant="stripped"
              aria-label={t('myNdla.iconMenu.more')}
            >
              <DragHorizontal />
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
    name: t('myNdla.myPage.myPage'),
    shortName: t('myNdla.myNDLA'),
    icon: <ProfilePersonOutlined />,
    iconFilled: <ProfilePerson />,
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
  },
  {
    id: 'logout-path',
    name: t('user.buttonLogOut'),
    shortName: t('user.buttonLogOut'),
    icon: <LogOut />,
    to: `/logout?state=${toHref(location)}`,
  },
];
