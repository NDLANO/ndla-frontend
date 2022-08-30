/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useState } from 'react';
import { keyBy } from 'lodash';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { HelmetWithTracker } from '@ndla/tracker';
import { spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { ListResource, useSnack } from '@ndla/ui';
import { copyTextToClipboard } from '@ndla/util';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Link } from '@ndla/icons/common';
import config from '../../../config';
import { useFolderResourceMetaSearch, useFolders } from '../folderMutations';
import TagsBreadcrumb from './TagsBreadcrumb';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { getAllTags, getResourcesForTag } from '../../../util/folderHelpers';
import IsMobileContext from '../../../IsMobileContext';
import { BlockWrapper, ViewType } from '../Folders/FoldersPage';
import { GQLFolderResource } from '../../../graphqlTypes';
import ListViewOptions from '../Folders/ListViewOptions';
import { ResourceAction } from '../Folders/ResourceList';
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';

interface TagsContainerProps {
  isMobile?: boolean;
}

const TagsContainer = styled.div<TagsContainerProps>`
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const TagsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  flex: 1;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: fit-content;
`;

const TagsPage = () => {
  const { folders } = useFolders();
  const { tag } = useParams();
  const { t } = useTranslation();
  const tags = getAllTags(folders);
  const resources = tag ? getResourcesForTag(folders, tag) : [];
  const isMobile = useContext(IsMobileContext);

  if (tag && tags && !tags.includes(tag)) {
    return <NotFoundPage />;
  }

  return (
    <TagsPageContainer>
      <HelmetWithTracker
        title={
          tag ? t('htmlTitles.myTagPage', { tag }) : t('htmlTitles.myTagsPage')
        }
      />
      <TagsBreadcrumb
        tag={tag}
        tagCount={tags?.length}
        resourceCount={resources?.length}
      />
      {!tag && <Tags isMobile={isMobile} tags={tags} />}
      {tag && resources && <Resources resources={resources} />}
    </TagsPageContainer>
  );
};

interface TagsProps {
  isMobile?: boolean;
  tags: string[];
}

interface ResourcesProps {
  resources: GQLFolderResource[];
}

const Resources = ({ resources }: ResourcesProps) => {
  const [type, setType] = useState<ViewType>('list');
  const { addSnack } = useSnack();
  const [resourceAction, setResourceAction] = useState<
    ResourceAction | undefined
  >(undefined);
  const { t } = useTranslation();
  const { data, loading } = useFolderResourceMetaSearch(
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
  return (
    <>
      <ListViewOptions type={type} onTypeChange={setType} />
      {resources.map(resource => {
        const meta =
          keyedData[`${resource.resourceType}-${resource.resourceId}`];
        return (
          <BlockWrapper type={type}>
            <ListResource
              tagLinkPrefix="/minndla/tags"
              isLoading={loading}
              key={resource.id}
              link={resource.path}
              title={meta?.title ?? ''}
              description={
                type !== 'list' ? meta?.description ?? '' : undefined
              }
              tags={resource.tags}
              topics={meta?.resourceTypes.map(rt => rt.name) ?? []}
              resourceImage={{
                src: meta?.metaImage?.url ?? '',
                alt: '',
              }}
              menuItems={[
                {
                  icon: <FolderOutlined />,
                  text: t('myNdla.resource.add'),
                  onClick: () => setResourceAction({ action: 'add', resource }),
                },
                {
                  icon: <Link />,
                  text: t('myNdla.resource.copyLink'),
                  onClick: () => {
                    copyTextToClipboard(
                      `${config.ndlaFrontendDomain}${resource.path}`,
                    );
                    addSnack({
                      content: t('myNdla.resource.linkCopied'),
                      id: 'linkCopied',
                    });
                  },
                },
              ]}
            />
          </BlockWrapper>
        );
      })}
      {resourceAction && (
        <>
          <AddResourceToFolderModal
            isOpen={resourceAction.action === 'add'}
            onClose={() => setResourceAction(undefined)}
            resource={{
              id: resourceAction.resource.resourceId,
              resourceType: resourceAction.resource.resourceType,
              path: resourceAction.resource.path,
            }}
          />
        </>
      )}
    </>
  );
};

const Tags = ({ isMobile, tags }: TagsProps) => {
  return (
    <TagsContainer isMobile={isMobile}>
      {tags.map(tag => (
        <StyledSafeLinkButton
          greyLighter
          borderShape="rounded"
          key={tag}
          to={tag}>
          #{tag}
        </StyledSafeLinkButton>
      ))}
    </TagsContainer>
  );
};

export default TagsPage;
