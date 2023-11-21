/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { useParams } from 'react-router';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import PostCard from '../ArenaCards/PostCard';
import { useArenaCategory, useArenaTopic } from '../arenaMutations';
import { GQLArenaPost } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.normal};
  margin-bottom: ${spacing.large};
`;

const PostCardWrapper = styled.div`
  margin-bottom: ${spacing.normal};
`;

const PostsPage = () => {
  const { topicId } = useParams();
  const { arenaTopic, loading } = useArenaTopic(Number(topicId), 1);
  const { arenaCategory } = useArenaCategory(Number(arenaTopic?.categoryId), 1);

  if (loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper>
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={
            topicId
              ? [
                  {
                    name: arenaCategory?.name ?? '',
                    id: `category/${arenaTopic?.categoryId.toString()}` ?? '',
                  },
                  { name: arenaTopic?.title ?? '', id: topicId },
                ]
              : []
          }
          page={'arena'}
        />
      </BreadcrumbWrapper>
      {arenaTopic?.posts?.map((post: GQLArenaPost) => (
        <PostCardWrapper key={post.id}>
          <PostCard
            id={post.id.toString()}
            isMainPost={post.isMainPost}
            title={arenaTopic.title ?? ''}
            content={post.content}
            notify={true}
          />
        </PostCardWrapper>
      ))}
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
