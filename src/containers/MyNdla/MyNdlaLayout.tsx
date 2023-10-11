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
import { breakpoints, colors, mq, spacing, spacingUnit } from '@ndla/core';
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
import { TFunction } from 'i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import { useFolder, useFolders } from './folderMutations';
import IsMobileContext from '../../IsMobileContext';
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
  margin: unset !important;
  padding: unset;

  ${mq.range({ from: breakpoints.mobileWide })} {
    flex-direction: column;
    padding: 0 1rem 0 0;
  }
`;

const StyledLi = styled.li`
  margin: 0;

  &:not(:nth-child(-n + 4)) {
    display: none;
  }

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: unset !important;
  }
`;

const StyledContent = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${spacing.large};

  &[data-is-mobile='true'] {
    padding: 0 ${spacing.nsmall} ${spacingUnit * 5}px ${spacing.nsmall};
  }
`;

const StyledSideBar = styled.div`
  display: flex;
  flex-direction: row;
  border-right: 1px solid ${colors.brand.lighter};
  background: ${colors.background.lightBlue};
  justify-content: center;

  ${mq.range({ from: breakpoints.mobileWide })} {
    padding: 0 0 ${spacing.small} ${spacing.normal};
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
  padding: ${spacing.small} ${spacing.xsmall};
  gap: ${spacing.xxsmall};
  line-height: ${spacing.small};

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: ${spacing.small};

  ${mq.range({ from: breakpoints.mobileWide })} {
    flex-direction: column;
  }
`;

const MyNdlaLayout = () => {
  const { folders } = useFolders();
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const location = useLocation();
  const [page, folderId] = location.pathname
    .replace('/minndla/', '')
    .split('/');
  const selectedFolder = useFolder(folderId);
  const isMobile = useContext(IsMobileContext);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <StyledLayout>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <StyledSideBar>
          <StyledDiv>
            <nav>
              <StyledNavList role="tablist">
                {menuActions(t, location).map(
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
                  ),
                )}
              </StyledNavList>
            </nav>
            <ModalTrigger>
              <MoreButton variant="stripped" aria-label="Mer">
                <DragHorizontal />
                {t('Mer')}
              </MoreButton>
            </ModalTrigger>
          </StyledDiv>
        </StyledSideBar>
        <StyledContent data-is-mobile={isMobile}>
          {examLock && (
            <MessageboxWrapper>
              <MessageBox>{t('myNdla.examLockInfo')}</MessageBox>
            </MessageboxWrapper>
          )}
          <Outlet context={{ setIsOpen }} />
        </StyledContent>
      </Modal>
    </StyledLayout>
  );
};

export default MyNdlaLayout;

export interface OutletContext {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const menuActions = (t: TFunction, location: Location) => [
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
    id: 'logout-path',
    name: t('user.buttonLogOut'),
    shortName: t('user.buttonLogOut'),
    icon: <LogOut />,
    to: `/logout?state=${toHref(location)}`,
  },
];
