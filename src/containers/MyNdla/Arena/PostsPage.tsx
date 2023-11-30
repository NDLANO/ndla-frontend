/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import PostCard from './components/PostCard';
import { useArenaCategory, useArenaTopic } from '../arenaQueries';
import { GQLArenaPostFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import { AuthContext } from '../../../components/AuthenticationContext';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
  padding-bottom: ${spacing.large};
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const PostCardWrapper = styled.li`
  list-style: none;
  margin-bottom: ${spacing.normal};
  &[data-mainPost='false'] {
    margin-left: 72px;
  }
`;

const PostsPage = () => {
  const { topicId } = useParams();
  const { arenaTopic, loading } = useArenaTopic(Number(topicId), 1);
  const { arenaCategory } = useArenaCategory(Number(arenaTopic?.categoryId), 1);
  const { user } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
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
                    id: `category/${arenaTopic?.categoryId}`,
                  },
                  { name: arenaTopic?.title ?? '', id: topicId },
                ]
              : []
          }
          page={'arena'}
        />
      </BreadcrumbWrapper>
      <ListWrapper>
        {arenaTopic?.posts
          ?.filter(({ deleted }) => !deleted)
          .map((post: GQLArenaPostFragmentFragment) => (
            <PostCardWrapper
              id={`post-${post.id}`}
              key={post.id}
              data-mainPost={post.isMainPost}
            >
              <PostCard
                id={post.id}
                timestamp={post.timestamp}
                isMainPost={post.isMainPost}
                title={arenaTopic.title ?? ''}
                content={post.content}
                displayName={post.user.displayName}
                username={post.user.username}
                topicId={arenaTopic.id}
                categoryId={arenaCategory?.id}
                // missing affiliation in user
                affiliation=""
              />
            </PostCardWrapper>
          ))}
      </ListWrapper>
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
