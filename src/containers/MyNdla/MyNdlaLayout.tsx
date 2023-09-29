/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useContext } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { MessageBox, TreeStructure } from '@ndla/ui';
import { SafeLinkButton } from '@ndla/safelink';
import { FolderOutlined } from '@ndla/icons/contentType';
import { HashTag, Person } from '@ndla/icons/common';
import { MenuBook } from '@ndla/icons/action';
import { TFunction } from 'i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import { useFolder, useFolders } from './folderMutations';
import IsMobileContext from '../../IsMobileContext';
import { toHref } from '../../util/urlHelper';
import NavigationLink from './components/NavigationLink';

const navigationLinks = (t: TFunction) => [
  {
    id: 'tags',
    icon: <HashTag />,
    name: t('myNdla.myTags'),
  },
  {
    id: 'subjects',
    icon: <MenuBook />,
    name: t('myNdla.favoriteSubjects.title'),
  },
];

const StyledLayout = styled.div`
  display: grid;
  min-height: 60vh;
  grid-template-columns:
    minmax(auto, 1fr) minmax(auto, 1496px)
    minmax(0px, 1fr);

  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
  }
`;

const StyledNavList = styled.ul`
  list-style: none;
`;

const StyledLi = styled.li`
  margin: 0;
`;

const StyledContent = styled.main`
  max-width: 1400px;
  flex: 1;
  margin: 0 ${spacing.large};

  &[data-is-mobile='true'] {
    margin: 0 ${spacing.nsmall};
  }
`;

const StyledSideBar = styled.div`
  padding-left: ${spacing.normal};
  display: flex;
  gap: ${spacing.normal};
  flex-direction: column;
  min-width: 300px;
  width: 300px;
  border-right: 1px solid ${colors.brand.lighter};
  background: ${colors.background.lightBlue};

  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  padding: 0 ${spacing.normal};
`;

const MessageboxWrapper = styled.div`
  margin-bottom: ${spacing.nsmall};
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

  const links = useMemo(() => {
    return navigationLinks(t);
  }, [t]);

  const showFolders =
    location.pathname.startsWith('/minndla/folders') && folders.length > 0;

  return (
    <StyledLayout>
      <StyledSideBar>
        <div>
          <nav>
            <StyledNavList role="tablist">
              <StyledLi role="none">
                <NavigationLink
                  id=""
                  name={t('myNdla.myPage.myPage')}
                  icon={<Person />}
                />
              </StyledLi>
              <StyledLi role="none">
                <NavigationLink
                  id="folders"
                  name={t('myNdla.myFolders')}
                  icon={<FolderOutlined />}
                  expanded={showFolders}
                />
                {showFolders && (
                  <TreeStructure
                    type={'navigation'}
                    folders={folders}
                    defaultOpenFolders={defaultSelected}
                  />
                )}
              </StyledLi>
              {links.map((link) => (
                <StyledLi key={link.id} role="none">
                  <NavigationLink
                    id={link.id}
                    name={link.name}
                    icon={link.icon}
                  />
                </StyledLi>
              ))}
            </StyledNavList>
          </nav>
          <ButtonWrapper>
            <SafeLinkButton
              variant="outline"
              reloadDocument
              to={`/logout?state=${toHref(location)}`}
            >
              {t('user.buttonLogOut')}
            </SafeLinkButton>
          </ButtonWrapper>
        </div>
      </StyledSideBar>
      <StyledContent data-is-mobile={isMobile}>
        {examLock && (
          <MessageboxWrapper>
            <MessageBox>{t('myNdla.examLockInfo')}</MessageBox>
          </MessageboxWrapper>
        )}
        <Outlet />
      </StyledContent>
    </StyledLayout>
  );
};

export default MyNdlaLayout;
