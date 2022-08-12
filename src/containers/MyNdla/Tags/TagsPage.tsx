/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { keyBy } from 'lodash';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { HelmetWithTracker } from '@ndla/tracker';
import { spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { ListResource } from '@ndla/ui';
import { useFolderResourceMetaSearch, useFolders } from '../folderMutations';
import TagsBreadcrumb from './TagsBreadcrumb';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import { getAllTags, getResourcesForTag } from '../../../util/folderHelpers';
import IsMobileContext from '../../../IsMobileContext';

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
  const { data, loading } = useFolderResourceMetaSearch(
    resources.map(res => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );

  if (tag && tags && !tags.includes(tag)) {
    return <NotFoundPage />;
  }

  const keyedData = keyBy(
    data ?? [],
    resource => `${resource.type}-${resource.id}`,
  );

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
      {!tag && (
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
      )}
      {resources?.map(resource => {
        const meta =
          keyedData[`${resource.resourceType}-${resource.resourceId}`];
        return (
          <ListResource
            tagLinkPrefix="/minndla/tags"
            isLoading={loading}
            key={resource.id}
            link={resource.path}
            title={meta?.title ?? ''}
            tags={resource.tags}
            topics={meta?.resourceTypes.map(rt => rt.name) ?? []}
            resourceImage={{
              src: meta?.metaImage?.url ?? '',
              alt: meta?.metaImage?.url ?? '',
            }}
          />
        );
      })}
    </TagsPageContainer>
  );
};

export default TagsPage;
