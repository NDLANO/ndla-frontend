/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, misc, mq, spacing } from '@ndla/core';
import { HumanMaleBoard } from '@ndla/icons/common';
import keyBy from 'lodash/keyBy';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GQLFolder, GQLFolderResource } from '../../graphqlTypes';
import {
  useFolderResourceMetaSearch,
  useSharedFolder,
} from '../MyNdla/folderMutations';
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

const SharedFolderPage = () => {
  const { folderId = '', resourceId } = useParams();
  const { t } = useTranslation();

  const { folder, loading } = useSharedFolder({
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
        <title>{`${folder?.name} - ${articleMeta?.title} - NDLA`}</title>
      </Helmet>
      <Sidebar>
        {!isMobile && (
          <InfoBox>
            <HumanMaleBoard />
            <span>{t('myNdla.sharedFolder.info')}</span>
          </InfoBox>
        )}
        <FolderNavigation folder={folder} meta={keyedData} loading={loading} />
      </Sidebar>
      <StyledSection>
        {selectedResource ? (
          <SharedArticle resource={selectedResource} meta={articleMeta} />
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

export default SharedFolderPage;
