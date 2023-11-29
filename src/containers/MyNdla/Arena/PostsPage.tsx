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
import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PostCard from './components/PostCard';
import { useArenaCategory, useArenaTopic } from '../arenaQueries';
import { GQLArenaPostFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import { usePersonalData } from '../userMutations';
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
  const { authenticated } = useContext(AuthContext);
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  useEffect(() => {
    if (arenaTopic?.deleted) {
      navigate('/minndla');
    }
  }, [arenaTopic?.deleted, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (!personalData?.arenaEnabled && personalData?.arenaEnabled !== undefined) {
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
                    id: `category/${arenaTopic?.categoryId.toString()}` ?? '',
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
                notify={true}
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
