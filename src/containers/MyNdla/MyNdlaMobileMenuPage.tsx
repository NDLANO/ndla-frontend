/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { HashTag, Person } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import styled from '@emotion/styled';
import { HelmetWithTracker } from '@ndla/tracker';
import IsMobileContext from '../../IsMobileContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import NavigationLink from './components/NavigationLink';

const MenuPageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledHeading = styled.h2`
  margin: 0;
`;

const MyNdlaMobileMenuPage = () => {
  const { t } = useTranslation();
  const isMobile = useContext(IsMobileContext);

  if (!isMobile) {
    return <NotFoundPage />;
  }

  return (
    <MenuPageContainer>
      <HelmetWithTracker title={t('htmlTitles.myNdlaPage')} />
      <StyledHeading>{t('myNdla.myNDLA')}</StyledHeading>
      <NavigationLink
        id=""
        icon={<Person />}
        name={t('myNdla.myPage.myPage')}
      />
      <NavigationLink
        id="folders"
        icon={<FolderOutlined />}
        name={t('myNdla.myFolders')}
      />
      <NavigationLink id="tags" icon={<HashTag />} name={t('myNdla.myTags')} />
    </MenuPageContainer>
  );
};

export default MyNdlaMobileMenuPage;
