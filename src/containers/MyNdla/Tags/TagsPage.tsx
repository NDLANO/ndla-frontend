/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { ListResource } from '@ndla/ui';
import { keyBy } from 'lodash';
import { useParams } from 'react-router-dom';
import { getAllTags, getResourcesForTag } from '../folderHelpers';
import { useFolderResourceMetaSearch, useFolders } from '../folderMutations';
import TagsBreadcrumb from './TagsBreadcrumb';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';

const TagsContainer = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const TagsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.small};
  flex: 1;
`;

const TagsPage = () => {
  const { folders } = useFolders();
  const { tag } = useParams();
  const tags = getAllTags(folders);
  const resources = tag ? getResourcesForTag(folders, tag) : [];
  const { data } = useFolderResourceMetaSearch(
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

  const keyedData = keyBy(data ?? [], r => `${r.type}${r.id}`);

  return (
    <TagsPageContainer>
      <TagsBreadcrumb
        tag={tag}
        tagCount={tags?.length}
        resourceCount={resources?.length}
      />
      {!tag && (
        <TagsContainer>
          {tags.map(tag => (
            <SafeLinkButton
              lighter
              borderShape="rounded"
              key={tag}
              to={`${tag}`}>
              #{tag}
            </SafeLinkButton>
          ))}
        </TagsContainer>
      )}
      {resources?.map(resource => {
        const meta =
          keyedData[`${resource.resourceType}${resource.resourceId}`];
        return (
          <ListResource
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
