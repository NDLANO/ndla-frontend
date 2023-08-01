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
import { HumanMaleBoard } from '@ndla/icons/common';
import {
  Drawer,
  Modal,
  ModalCloseButton,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { ErrorMessage, OneColumn } from '@ndla/ui';
import keyBy from 'lodash/keyBy';
import { useCallback, useContext, useState } from 'react';
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
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import ResourceEmbed, {
  StandaloneEmbed,
} from '../ResourceEmbed/components/ResourceEmbed';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;

  ${mq.range({ until: breakpoints.desktop })} {
    display: flex;
    flex-direction: column;
  }
`;

const Sidebar = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: ${spacing.normal};

  ${mq.range({ until: breakpoints.desktop })} {
    padding: 0;
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

  ${mq.range({ until: breakpoints.desktop })} {
    margin: 0 ${spacing.small};
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
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.nsmall};
  justify-content: center;
  color: ${colors.text};
  background-color: ${colors.brand.greyLighter};
  border-top: 2px solid ${colors.brand.tertiary};
  width: 100%;
  z-index: 10;
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
  ${mq.range({ until: breakpoints.desktop })} {
    display: flex;
    flex-direction: column;
  }
`;

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  margin: 0;
  max-width: 100%;
  ${mq.range({ until: breakpoints.desktop })} {
    min-height: 20%;
  }
`;

const StyledDrawerContent = styled.div`
  padding-bottom: ${spacing.large};
`;

const LandingPageMobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding: ${spacing.small};
`;

const embedResourceTypes = ['video', 'audio', 'concept', 'image'];

const SharedFolderPage = () => {
  const [open, setOpen] = useState(false);
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
    resources.map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );

  const close = useCallback(() => setOpen(false), []);

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
    (resource) => `${resource.type}-${resource.id}`,
  );

  const selectedResource = resources.find((res) => res.id === resourceId);
  const articleMeta =
    keyedData[
      `${selectedResource?.resourceType}-${selectedResource?.resourceId}`
    ];

  const title = `${folder.name} - ${articleMeta?.title ?? t('sharedFolder')}`;

  return (
    <Layout>
      <SocialMediaMetadata
        type="website"
        title={title}
        description={t('myNdla.sharedFolder.description.info1')}
      />
      <Sidebar>
        {!isMobile ? (
          <DesktopPadding>
            <InfoBox>
              <HumanMaleBoard />
              <span>{t('myNdla.sharedFolder.info')}</span>
            </InfoBox>
            <FolderNavigation folder={folder} meta={keyedData} />
          </DesktopPadding>
        ) : isMobile && selectedResource ? (
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger>
              <DrawerButton shape="sharp" colorTheme="light">
                <span id="folder-drawer-button">
                  {t('myNdla.sharedFolder.drawerButton')}
                </span>
              </DrawerButton>
              <StyledDrawer
                position="bottom"
                size="small"
                expands
                aria-labelledby="folder-drawer-button"
              >
                <StyledDrawerContent>
                  <ModalHeader>
                    <h1>{t('myNdla.sharedFolder.drawerTitle')}</h1>
                    <ModalCloseButton />
                  </ModalHeader>
                  <FolderNavigation
                    onClose={close}
                    folder={folder}
                    meta={keyedData}
                  />
                </StyledDrawerContent>
              </StyledDrawer>
            </ModalTrigger>
          </Modal>
        ) : null}
      </Sidebar>
      <StyledSection>
        {selectedResource ? (
          selectedResource.resourceType === 'learningpath' ||
          selectedResource.resourceType === 'multidisciplinary' ? (
            <SharedLearningpathWarning />
          ) : embedResourceTypes.includes(selectedResource.resourceType) ? (
            <ResourceEmbed
              id={selectedResource.resourceId}
              type={selectedResource.resourceType as StandaloneEmbed}
              noBackground
            />
          ) : (
            <SharedArticle
              resource={selectedResource}
              meta={articleMeta}
              title={title}
            />
          )
        ) : (
          <FolderMeta folder={folder} title={title} />
        )}
        {!selectedResource && isMobile && (
          <LandingPageMobileWrapper>
            <InfoBox>
              <HumanMaleBoard />
              <span>{t('myNdla.sharedFolder.info')}</span>
            </InfoBox>
            <FolderNavigation folder={folder} meta={keyedData} />
          </LandingPageMobileWrapper>
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
