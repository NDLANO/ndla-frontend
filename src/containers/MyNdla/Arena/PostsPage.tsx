/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import PostCard from './components/PostCard';
import { useArenaCategory, useArenaTopic } from '../arenaQueries';
import { GQLArenaPostFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import { AuthContext } from '../../../components/AuthenticationContext';
import { getAllDimensions } from '../../../util/trackingUtil';

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
  &[data-main-post='false'] {
    margin-left: 72px;
  }
`;

const PostsPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const { arenaTopic, loading } = useArenaTopic({
    variables: { topicId: Number(topicId), page: 1 },
    skip: !Number(topicId),
  });
  const { arenaCategory } = useArenaCategory({
    variables: { categoryId: Number(arenaTopic?.categoryId), page: 1 },
    skip: !Number(arenaTopic?.categoryId),
  });
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t('htmlTitles.arenaPostPage', { name: arenaTopic?.title ?? '' }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker
        title={t('htmlTitles.arenaPostPage', { name: arenaTopic?.title })}
      />
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
        {arenaTopic?.posts?.map((post: GQLArenaPostFragmentFragment) => (
          <PostCardWrapper key={post.id} data-main-post={post.isMainPost}>
            <PostCard
              id={post.id}
              timestamp={post.timestamp}
              isMainPost={post.isMainPost}
              title={arenaTopic.title ?? ''}
              content={post.content}
              notify={true}
              displayName={post.user.displayName}
              username={post.user.username}
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
