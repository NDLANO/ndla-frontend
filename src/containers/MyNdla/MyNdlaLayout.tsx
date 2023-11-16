/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useContext, useState, Dispatch, SetStateAction } from 'react';
import { Location, Outlet, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { MessageBox, TreeStructure } from '@ndla/ui';
import { FolderOutlined } from '@ndla/icons/contentType';
import {
  Book,
  BookOutlined,
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
import { useFolder, useFolders } from './folderMutations';
import NavigationLink from './components/NavigationLink';
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
  display: flex;
  flex-direction: row;
  margin: 0px;
  padding: unset;
  justify-content: space-between;

  ${mq.range({ from: breakpoints.mobileWide })} {
    flex-direction: column;
  }
`;

const StyledNav = styled.nav`
  width: 100%;
  padding-right: ${spacing.small};
`;

const StyledLi = styled.li`
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
  border-right: 1px solid ${colors.brand.lighter};
  background: ${colors.background.lightBlue};
  justify-content: center;
  padding: ${spacing.xsmall};

  ${mq.range({ from: breakpoints.mobileWide })} {
    padding: ${spacing.nsmall};
  }

  ${mq.range({ from: breakpoints.desktop })} {
    justify-content: flex-start;
    gap: ${spacing.normal};
    flex-direction: column;
    min-width: 300px;
  }
`;

const MessageboxWrapper = styled.div`
  margin-bottom: ${spacing.nsmall};
`;

const TreeStructureWrapper = styled.div`
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
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
  const { folders } = useFolders();
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const location = useLocation();
  const [page, folderId] = location.pathname
    .replace('/minndla/', '')
    .split('/');
  const selectedFolder = useFolder(folderId);
  const [isOpen, setIsOpen] = useState(false);
  const [resetFocus, setResetFocus] = useState(false);

  const defaultSelected = useMemo(() => {
    if (typeof page === 'string') {
      if (folderId) {
        return [page].concat(
          selectedFolder?.breadcrumbs.map((b) => b.id) ?? [],
        );
      }
      return [page];
    }
    return [];
  }, [selectedFolder?.breadcrumbs, folderId, page]);

  const showFolders =
    location.pathname.startsWith('/minndla/folders') && folders.length > 0;

  const menuLink = useMemo(
    () =>
      menuLinks(t, location)
        .slice(0, 4)
        .map(({ name, shortName, id, icon, to, iconFilled }) => (
          <StyledLi key={id} role="none">
            <NavigationLink
              id={id}
              name={name}
              shortName={shortName}
              icon={icon}
              to={to}
              iconFilled={iconFilled}
            />
            {showFolders && id === 'folders' && (
              <TreeStructureWrapper>
                <TreeStructure
                  type="navigation"
                  folders={folders}
                  defaultOpenFolders={defaultSelected}
                />
              </TreeStructureWrapper>
            )}
          </StyledLi>
        )),
    [location, t, folders, showFolders, defaultSelected],
  );

  return (
    <StyledLayout>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <StyledSideBar>
          <StyledNav>
            <StyledNavList role="tablist">{menuLink}</StyledNavList>
          </StyledNav>
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
    id: '/folders',
    name: t('myNdla.myFolders'),
    shortName: t('myNdla.iconMenu.folders'),
    icon: <FolderOutlined />,
    iconFilled: <Folder />,
  },
  {
    id: '/subjects',
    name: t('myNdla.favoriteSubjects.title'),
    shortName: t('myNdla.iconMenu.subjects'),
    icon: <BookOutlined />,
    iconFilled: <Book />,
  },
  {
    id: '/tags',
    name: t('myNdla.myTags'),
    shortName: t('myNdla.iconMenu.tags'),
    icon: <HashTag />,
  },
  {
    id: '/logout-path',
    name: t('user.buttonLogOut'),
    shortName: t('user.buttonLogOut'),
    icon: <LogOut />,
    to: `/logout?state=${toHref(location)}`,
  },
];
