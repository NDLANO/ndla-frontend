/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, colors, misc, mq, spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { ChevronRight, ChevronUp, HumanMaleBoard } from '@ndla/icons/common';
import { Drawer, ModalCloseButton, ModalHeaderV2 } from '@ndla/modal';
import { ErrorMessage, OneColumn } from '@ndla/ui';
import keyBy from 'lodash/keyBy';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GQLFolder, GQLFolderResource } from '../../graphqlTypes';
import IsMobileContext from '../../IsMobileContext';
import ErrorPage from '../ErrorPage';
import {
  useFolderResourceMetaSearch,
  useSharedFolder,
} from '../MyNdla/folderMutations';
import NotFound from '../NotFoundPage/NotFoundPage';
import FolderMeta from './components/FolderMeta';
import FolderNavigation from './components/FolderNavigation';
import SharedArticle from './components/SharedArticle';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;

  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
    flex-direction: column;
  }
`;

const Sidebar = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: ${spacing.normal};
  box-shadow: 0px 1px 4px 0px ${colors.brand.neutral7};

  ${mq.range({ until: breakpoints.tablet })} {
    padding: 0;
    box-shadow: none;
  }
`;

const StyledSection = styled.section`
  margin-top: ${spacing.large};
`;

const InfoBox = styled.article`
  display: grid;
  grid-template-columns: auto 1fr;
  svg {
    width: 20px;
    height: 20px;
    margin-top: ${spacing.xsmall};
  }
  gap: ${spacing.normal};
  margin-left: ${spacing.nsmall};
  padding: ${spacing.small} ${spacing.normal};
  background: ${colors.brand.greyLightest};
  border: 1px solid ${colors.brand.neutral7};
  gap: ${spacing.small};
  border-radius: ${misc.borderRadius};

  ${mq.range({ until: breakpoints.tablet })} {
    margin: 0 ${spacing.nsmall};
  }
`;

const flattenResources = (folder?: GQLFolder): GQLFolderResource[] => {
  if (!folder) {
    return [];
  }
  const subResources = folder.subfolders.flatMap(flattenResources);

  return folder.resources.concat(subResources);
};

const DrawerButton = styled(ButtonV2)`
  position: fixed;
  bottom: 0;
  padding-left: ${spacing.large};
  justify-content: flex-start;
  color: ${colors.text};
  background-color: ${colors.white};
  border-top: 1px solid ${colors.brand.light};
  width: 100%;
  z-index: 10;
  &:focus,
  &:focus-within,
  &:hover {
    border-top: 1px solid ${colors.brand.light};
    background-color: ${colors.brand.greyLight};
  }
  &:focus-within,
  &:active {
    color: ${colors.text.primary} !important;
  }
`;

const DesktopPadding = styled.div`
  padding-bottom: 80px;
`;

const InsideDrawerButton = styled(ButtonV2)`
  padding-left: ${spacing.large};
  justify-content: flex-start;
`;

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 20%;
  }
`;

const SharedFolderPage = () => {
  const { folderId = '', resourceId } = useParams();
  const { t } = useTranslation();
  const isMobile = useContext(IsMobileContext);

  const { folder, loading, error } = useSharedFolder({
    id: folderId,
    includeResources: true,
    includeSubfolders: true,
  });

  const resources = flattenResources(folder);

  const { data } = useFolderResourceMetaSearch(
    resources.map(res => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );

  if (loading) {
    return <Spinner />;
  }

  if (error?.graphQLErrors[0]?.extensions?.status === 404) {
    return <NotFound />;
  } else if (error || !folder) {
    return <ErrorPage />;
  }

  const keyedData = keyBy(
    data ?? [],
    resource => `${resource.type}-${resource.id}`,
  );

  const selectedResource = resources.find(res => res.id === resourceId);
  const articleMeta =
    keyedData[
      `${selectedResource?.resourceType}-${selectedResource?.resourceId}`
    ];

  return (
    <Layout>
      <Helmet>
        <title>
          {t('htmlTitles.sharedFolderPage', {
            name: `${folder.name} - ${articleMeta?.title ?? t('sharedFolder')}`,
          })}
        </title>
      </Helmet>
      <Sidebar>
        {!isMobile ? (
          <DesktopPadding>
            <InfoBox>
              <HumanMaleBoard />
              <span>{t('myNdla.sharedFolder.info')}</span>
            </InfoBox>
            <FolderNavigation folder={folder} meta={keyedData} />
          </DesktopPadding>
        ) : (
          <StyledDrawer
            position="bottom"
            size="small"
            labelledBy="folder-drawer-button"
            activateButton={
              <DrawerButton shape="sharp" variant="stripped" size="large">
                <ChevronRight />
                <span id="folder-drawer-button">
                  {t('myNdla.sharedFolder.drawerButton')}
                </span>
              </DrawerButton>
            }>
            {close => (
              <>
                <ModalHeaderV2>
                  <h1>{t('myNdla.sharedFolder.drawerTitle')}</h1>
                  <ModalCloseButton onClick={close} />
                </ModalHeaderV2>
                <FolderNavigation
                  onClose={close}
                  folder={folder}
                  meta={keyedData}
                />
                <InsideDrawerButton
                  shape="sharp"
                  variant="stripped"
                  size="large"
                  onClick={close}>
                  <ChevronUp />
                  {t('myNdla.sharedFolder.drawerButton')}
                </InsideDrawerButton>
              </>
            )}
          </StyledDrawer>
        )}
      </Sidebar>
      <StyledSection>
        {selectedResource ? (
          selectedResource.resourceType === 'learningpath' ? (
            <SharedLearningpathWarning />
          ) : (
            <SharedArticle resource={selectedResource} meta={articleMeta} />
          )
        ) : (
          <FolderMeta folder={folder} />
        )}
        {isMobile && (
          <InfoBox>
            <HumanMaleBoard />
            <span>{t('myNdla.sharedFolder.info')}</span>
          </InfoBox>
        )}
      </StyledSection>
    </Layout>
  );
};

const SharedLearningpathWarning = () => {
  const { t } = useTranslation();

  return (
    <OneColumn>
      <ErrorMessage
        messages={{
          title: '',
          description: t('myNdla.sharedFolder.learningpathUnsupported'),
        }}
        illustration={{
          url: '/static/oops.gif',
          altText: t('errorMessage.title'),
        }}
      />
    </OneColumn>
  );
};

export default SharedFolderPage;
